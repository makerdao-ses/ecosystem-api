import {
  AnalyticsDiscretizer,
  GroupedPeriodResults,
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
      lod: query.lod,
      select: query.select,
      metrics: [query.expression.operand.metric],
      currency: query.expression.operand.currency,
    };
    return this._applyOperator(await this.execute(inputsQuery), await this.execute(operandQuery), query.expression.operator, query.expression.resultCurrency);
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
    // we\ll enhance it with price info      
    return this._resolveCurrencyConversions(discretizedResult);
  }

  public async test(): Promise<GroupedPeriodResults> {
    const query: AnalyticsQuery = {
      start: new Date("2022-01-01"),
      end: new Date("2023-01-01"),
      granularity: AnalyticsGranularity.Monthly,
      metrics: ['Budget', 'Actuals'],
      currency: AnalyticsPath.fromString('DAI'),
      select: {
        budget: [AnalyticsPath.fromString('atlas')],
      },
      lod: {
        budget: 3,
      },
    }
    return this.executeMultiCurrency(query, { targetCurrency: AnalyticsPath.fromString("DAI"), conversions: [{ metric: "DailyMkrPriceChange", currency: AnalyticsPath.fromString("MKR") }] })
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
            currency: baseQuery.currency,
          },
          operator: CompoundOperator.Multiply,
          operand: {
            metric: conversion.metric,
            currency: mcc.targetCurrency,
            useSum: true
          },
          resultCurrency: mcc.targetCurrency,
        }
      };

      result = await this._applyOperator(result, await this.executeCompound(nextQuery), CompoundOperator.Add, mcc.targetCurrency);
    }
    return result;
  }

  private async _applyOperator(
    resultA: GroupedPeriodResults, // expected input is the budget & actuals in 2022 monthly granularity in MKR
    resultB: GroupedPeriodResults, // expected input is the daily mkr price change in 2022 monthly granularity in DAI
    operator: CompoundOperator, // expected to me multiply and later addition
    resultCurrency: AnalyticsPath // expected to be DAI
  ): Promise<GroupedPeriodResults> {
    return resultA;
  }

  private async _resolveCurrencyConversions(discretizedResult: GroupedPeriodResults): Promise<GroupedPeriodResults> {
    // console.log('Resolving currency conversions and value is ', discretizedResult[0].rows)
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
}
