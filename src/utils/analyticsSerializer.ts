import { AnalyticsPath, AnalyticsQuery, AnalyticsGranularity } from "@powerhousedao/analytics-engine-core";

export function serializeAnalyticsQuery(query: AnalyticsQuery): string {
    return JSON.stringify(query, (key, value) => {
        if (value instanceof Date) {
            return { _type: 'Date', value: value.toISOString() };
        }
        if (value instanceof AnalyticsPath) {
            return value.toJSON();
        }
        if (key === 'select' || key === 'currency') {
            return Object.fromEntries(
                Object.entries(value).map(([k, v]) => [
                    k,
                    Array.isArray(v)
                        ? v.map(path => (path instanceof AnalyticsPath ? path.toJSON() : path))
                        : (v instanceof AnalyticsPath ? v.toJSON() : v)
                ])
            );
        }
        return value;
    });
}

export function deserializeAnalyticsQuery(json: string): AnalyticsQuery {
    return JSON.parse(json, (key, value) => {
      if (value === null) {
        return value;
      }
      if (key === 'start' || key === 'end') {
        return value ? new Date(value) : null;
      }
      if (key === 'granularity') {
        return value as AnalyticsGranularity;
      }
      if (key === 'currency' && typeof value === 'object') {
        return AnalyticsPath.fromJSON(value);
      }
      if (key === 'select') {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]: any) => [
            k,
            v.map((pathJson: any) => AnalyticsPath.fromJSON(pathJson))
          ])
        );
      }
      if (key === 'lod') {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]: any) => [k, Number(v)])
        );
      }
      return value;
    });
  }
