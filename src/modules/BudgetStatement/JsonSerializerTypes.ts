import {
  BudgetReportPath,
  BudgetReportPathSegment,
} from "./BudgetReportPath.js";
import { BudgetReportPeriod } from "./BudgetReportPeriod.js";

export enum JsonSerializerTypes {
  BudgetReportPath,
  BudgetReportPathSegment,
  BudgetReportPeriod,
}

export function reviver(k: any, v: any) {
  if (v instanceof Object && v._t === JsonSerializerTypes.BudgetReportPath) {
    return BudgetReportPath.fromString(v._v);
  }

  if (
    v instanceof Object &&
    v._t === JsonSerializerTypes.BudgetReportPathSegment
  ) {
    return BudgetReportPathSegment.fromString(v._v);
  }

  if (v instanceof Object && v._t === JsonSerializerTypes.BudgetReportPeriod) {
    return BudgetReportPeriod.fromString(v._v);
  }

  return v;
}
