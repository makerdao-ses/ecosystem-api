import {
  AnalyticsDiscretizer,
  GroupedPeriodResults,
  GroupedPeriodResult
} from "./AnalyticsDiscretizer.js";
import { AnalyticsPath } from "./AnalyticsPath.js";
import {
  AnalyticsGranularity,
  AnalyticsQuery,
  AnalyticsSeries,
  AnalyticsSeriesQuery,
  CompoundAnalyticsQuery,
  CompoundOperator,
  MultiCurrencyConversion
} from "./AnalyticsQuery.js";
import { AnalyticsStore } from "./AnalyticsStore.js";

export class AnalyticsQueryEngine {
  private _analyticsStore: AnalyticsStore;

  public constructor(store: AnalyticsStore) {
    this._analyticsStore = store;
  }

  public async executeCompound(query: CompoundAnalyticsQuery): Promise<GroupedPeriodResults> {
    const inputsQuery: AnalyticsQuery = {
      start: query.start,
      end: query.end,
      granularity: query.granularity,
      lod: query.lod,
      select: query.select,
      metrics: query.expression.inputs.metrics,
      currency: query.expression.inputs.currency,
    };

    const operandQuery: AnalyticsQuery = {
      start: query.start,
      end: query.end,
      granularity: query.granularity,
      lod: { 'priceData': 1 },
      select: { 'priceData': [AnalyticsPath.fromString('atlas')] },
      metrics: [query.expression.operand.metric],
      currency: query.expression.operand.currency,
    };
    const inputExecute = await this.execute(inputsQuery);
    const operandExecute = await this.execute(operandQuery);
    if ([CompoundOperator.VectorAdd, CompoundOperator.VectorSubtract].includes(query.expression.operator)) {
      return this._applyVectorOperator(inputExecute, operandExecute, query.expression.operator, query.expression.resultCurrency);
    }
    return this._applyScalarOperator(inputExecute, operandExecute, query.expression.operator, query.expression.operand.useSum, query.expression.resultCurrency);
  }

  public async execute(query: AnalyticsQuery): Promise<GroupedPeriodResults> {
    const dimensions = Object.keys(query.select);
    const seriesResults = await this._executeSeriesQuery(query)
    const normalizedSeriesResults = this._applyLods(seriesResults, query.lod),
      discretizedResult =
        normalizedSeriesResults.length < 1
          ? []
          : AnalyticsDiscretizer.discretize(
            normalizedSeriesResults,
            dimensions,
            query.start,
            query.end,
            query.granularity,
          );
    return this._resolveCurrencyConversions(discretizedResult);
  }

  public async test(): Promise<GroupedPeriodResults> {
    const query: AnalyticsQuery = {
      start: new Date("2023-10-01"),
      end: new Date("2024-01-01"),
      granularity: AnalyticsGranularity.Monthly,
      metrics: ['Budget'],
      currency: AnalyticsPath.fromString('DAI'),
      select: {
        budget: [AnalyticsPath.fromString('atlas')],
      },
      lod: {
        budget: 2,
      },
    }
    const conversions = {
      targetCurrency: AnalyticsPath.fromString("DAI"),
      conversions: [
        {
          metric: "DailyMkrPriceChange",
          currency: AnalyticsPath.fromString("MKR")
        }
      ]
    };
    return this.executeMultiCurrency(query, conversions)
  }

  public async executeMultiCurrency(query: AnalyticsQuery, mcc: MultiCurrencyConversion): Promise<GroupedPeriodResults> {
    const baseQuery: AnalyticsQuery = { ...query, currency: mcc.targetCurrency };
    let result = await this.execute(baseQuery);

    for (const conversion of mcc.conversions) {
      const nextQuery: CompoundAnalyticsQuery = {
        start: query.start,
        end: query.end,
        granularity: query.granularity,
        lod: query.lod,
        select: query.select,
        expression: {
          inputs: {
            metrics: baseQuery.metrics,
            currency: conversion.currency,
          },
          operator: CompoundOperator.ScalarMultiply,
          operand: {
            metric: conversion.metric,
            currency: mcc.targetCurrency,
            useSum: true
          },
          resultCurrency: mcc.targetCurrency,
        }
      };

      const executedCompound = await this.executeCompound(nextQuery);
      result = await this._applyVectorOperator(result, executedCompound, CompoundOperator.VectorAdd, mcc.targetCurrency);
    }
    return result;
  }

  private async _applyVectorOperator(
    inputsA: GroupedPeriodResults,
    inputsB: GroupedPeriodResults,
    operator: CompoundOperator,
    resultCurrency: AnalyticsPath
  ) {
    if ([CompoundOperator.ScalarMultiply, CompoundOperator.ScalarDivide].includes(operator)) {
      throw new Error('Invalid operator for vector operation');
    }
    return inputsB
  }

  private async _applyScalarOperator(
    inputs: GroupedPeriodResults, // expected input is the budget & actuals in 2022 monthly granularity in MKR
    operand: GroupedPeriodResults, // expected input is the daily mkr price change in 2022 monthly granularity in DAI
    operator: CompoundOperator, // expected to me multiply and later addition
    useOperandSum: boolean,
    resultCurrency: AnalyticsPath // expected to be DAI
  ): Promise<GroupedPeriodResults> {
    if ([CompoundOperator.VectorAdd, CompoundOperator.VectorSubtract].includes(operator)) {
      throw new Error('Invalid operator for scalar operation');
    }

    const result: GroupedPeriodResults = [];
    const operandMap: Record<string, number> = {};
    const key = useOperandSum ? 'sum' : 'value';

    for (const operandPeriod of operand) {
      if (operandPeriod.rows.length > 0) {
        operandMap[operandPeriod.period] = operandPeriod.rows[0][key];
      }
    }

    // let previousValue: number = 1;
    for (const inputPeriod of inputs) {
      const outputPeriod: GroupedPeriodResult = {
        period: inputPeriod.period,
        start: inputPeriod.start,
        end: inputPeriod.end,
        rows: inputPeriod.rows.map((row) => {
          const newRow = {
            dimensions: row.dimensions,
            metric: row.metric,
            unit: resultCurrency.toString(),
            value: this._calculateOutputValue(row.value, operator, operandMap[inputPeriod.period]),
            sum: -1
          };
          return newRow;
        })
      };
      result.push(outputPeriod);
    }

    return result;
  }

  private _calculateOutputValue(input: number, operator: CompoundOperator, operand: number): number {
    switch (operator) {
      case CompoundOperator.VectorAdd:
        return input + operand;
      case CompoundOperator.VectorSubtract:
        return input - operand;
      case CompoundOperator.ScalarMultiply:
        return input * operand;
      case CompoundOperator.ScalarDivide:
        return input / operand;
    }
  }

  private async _resolveCurrencyConversions(discretizedResult: GroupedPeriodResults): Promise<GroupedPeriodResults> {
    return discretizedResult;
  }

  private async _executeSeriesQuery(
    query: AnalyticsQuery,
  ): Promise<AnalyticsSeries<AnalyticsPath>[]> {
    const seriesQuery: AnalyticsSeriesQuery = {
      start: query.start,
      end: query.end,
      currency: query.currency,
      select: query.select,
      metrics: query.metrics,
    };

    return await this._analyticsStore.getMatchingSeries(seriesQuery);
  }

  private _applyLods(
    series: AnalyticsSeries<AnalyticsPath>[],
    lods: Record<string, number | null>,
  ): AnalyticsSeries<string>[] {
    return series.map((result) => ({
      ...result,
      dimensions: this._applyDimensionsLods(result.dimensions, lods),
    }));
  }

  private _applyDimensionsLods(
    dimensionMap: Record<string, AnalyticsPath> | any,
    lods: Record<string, number | null>,
  ) {
    const result: Record<string, string> | any = {};
    for (const [dimension, lod] of Object.entries(lods)) {
      if (lod !== null && dimensionMap[dimension]) {
        result[dimension] = dimensionMap[dimension]['path'].applyLod(lod).toString();
        result['icon'] = dimensionMap[dimension]['icon'].toString();
        result['label'] = dimensionMap[dimension]['label'].toString();
        result['description'] = dimensionMap[dimension]['description'].toString();
      }
    }
    return result;
  }

  public async getDimensions(): Promise<any> {
    return await this._analyticsStore.getDimensions();
  }

  public async getMetrics(): Promise<string[]> {
    return await this._analyticsStore.getMetrics();
  }

  public async getCurrencies(): Promise<string[]> {
    return await this._analyticsStore.getCurrencies();
  }
}
