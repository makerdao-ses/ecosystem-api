import { AnalyticsPath } from "./AnalyticsPath.js"

export enum AnalyticsGranularity {
    Total,
    Annual,
    SemiAnnual,
    Quarterly,
    Monthly,
    Weekly,
    Daily,
    Hourly
}

export enum AnalyticsMetric {
    Budget, 
    Forecast,
    Actuals,
    PaymentsOnChain,
    PaymentsOffChainIncluded,
    FTEs
}

export type AnalyticsMetricString = 
    | 'Budget'
    | 'Forecast'
    | 'Actuals'
    | 'PaymentsOnChain'
    | 'PaymentsOffChainIncluded'
    | 'FTEs'
    ;

export const getAnalyticsMetricEnum = (metric: AnalyticsMetricString): AnalyticsMetric => {
    switch(metric) {
        case "Budget":
            return AnalyticsMetric.Budget;
        case "Forecast":
            return AnalyticsMetric.Forecast;
        case "Actuals":
            return AnalyticsMetric.Actuals;
        case "PaymentsOnChain":
            return AnalyticsMetric.PaymentsOnChain;
        case "PaymentsOffChainIncluded":
            return AnalyticsMetric.PaymentsOffChainIncluded;
        case "FTEs":
            return AnalyticsMetric.FTEs;
    }
}

export const getAnalyticsMetricString = (metric: AnalyticsMetric): AnalyticsMetricString => {
    switch(metric) {
        case AnalyticsMetric.Budget:
            return 'Budget';
        case AnalyticsMetric.Forecast:
            return 'Forecast';
        case AnalyticsMetric.Actuals:
            return 'Actuals';
        case AnalyticsMetric.PaymentsOnChain:
            return 'PaymentsOnChain';
        case AnalyticsMetric.PaymentsOffChainIncluded:
            return 'PaymentsOffChainIncluded';
        case AnalyticsMetric.FTEs:
            return 'FTEs';
    }
}

export type AnalyticsSeriesQuery = {
    start: Date | null,
    end: Date | null,
    metrics: AnalyticsMetric[],
    currency: AnalyticsPath,
    filter: Record<string, AnalyticsPath[]>,
}

export type AnalyticsQuery = AnalyticsSeriesQuery | {
    granularity: AnalyticsGranularity,
    lod: Record<string, number|null>
}
