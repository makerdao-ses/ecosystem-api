import { AnalyticsPath, AnalyticsPathSegment } from "./AnalyticsPath.js";
import { AnalyticsPeriod } from "./AnalyticsPeriod.js";

export enum AnalyticsSerializerTypes {
    AnalyticsPath,
    AnalyticsPathSegment,
    AnalyticsPeriod
}

export function reviver(k:any, v:any) {
    if (v instanceof Object && v._t === AnalyticsSerializerTypes.AnalyticsPath) {
        return AnalyticsPath.fromString(v._v);
    }

    if (v instanceof Object && v._t === AnalyticsSerializerTypes.AnalyticsPathSegment) {
        return AnalyticsPathSegment.fromString(v._v);
    }

    if (v instanceof Object && v._t === AnalyticsSerializerTypes.AnalyticsPeriod) {
        return AnalyticsPeriod.fromString(v._v);
    }

    return v;
}