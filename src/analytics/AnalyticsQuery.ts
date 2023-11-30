import { AnalyticsPath } from "./AnalyticsPath.js";

export type AnalyticsSeriesQuery = {
  start: Date | null;
  end: Date | null;
  metrics: string[];
  currency: AnalyticsPath;
  select: Record<string, AnalyticsPath[]>;
};

export type AnalyticsQuery = AnalyticsSeriesQuery & {
  granularity: AnalyticsGranularity;
  lod: Record<string, number | null>;
};

export type AnalyticsSeries<D = string | AnalyticsPath> = {
  source: AnalyticsPath;
  start: Date;
  end: Date | null;
  metric: string;
  value: number;
  unit: string | null;
  fn: string;
  params: Record<string, any> | null;
  dimensions: Record<string, D>;
};

export enum AnalyticsMetric {
  Budget,
  Forecast,
  Actuals,
  PaymentsOnChain,
  PaymentsOffChainIncluded,
  FTEs,
}

export type AnalyticsMetricString =
  | "Budget"
  | "Forecast"
  | "Actuals"
  | "PaymentsOnChain"
  | "PaymentsOffChainIncluded"
  | "FTEs";

export const getAnalyticsMetricEnum = (
  metric: AnalyticsMetricString,
): AnalyticsMetric => {
  switch (metric) {
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
};

export const getAnalyticsMetricString = (
  metric: AnalyticsMetric,
): AnalyticsMetricString => {
  switch (metric) {
    case AnalyticsMetric.Budget:
      return "Budget";
    case AnalyticsMetric.Forecast:
      return "Forecast";
    case AnalyticsMetric.Actuals:
      return "Actuals";
    case AnalyticsMetric.PaymentsOnChain:
      return "PaymentsOnChain";
    case AnalyticsMetric.PaymentsOffChainIncluded:
      return "PaymentsOffChainIncluded";
    case AnalyticsMetric.FTEs:
      return "FTEs";
  }
};

export function toPascalCase(str: string) {
  return str
    .replace(/\w+/g, function (word) {
      return word[0].toUpperCase() + word.slice(1);
    })
    .replace(/\s+/g, '');
}

export enum AnalyticsGranularity {
  Total,
  Annual,
  SemiAnnual,
  Quarterly,
  Monthly,
  Weekly,
  Daily,
  Hourly,
}
