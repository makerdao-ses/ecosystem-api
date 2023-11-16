import { AnalyticsPath } from "./AnalyticsPath";
import { AnalyticsPeriod } from "./AnalyticsPeriod";

export type AnalyticsQueryResultRow = {
  period: AnalyticsPeriod;
  dimensions: Record<string, AnalyticsPath>;
  currency: string;
  value: number;
};

export type AnalyticsQueryResult = Array<AnalyticsQueryResultRow>;
