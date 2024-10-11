import { AnalyticsPath, AnalyticsPathSegment } from '../analytics/AnalyticsPath.js';
import { AnalyticsQuery, AnalyticsGranularity } from '../analytics/AnalyticsQuery.js';

function serializeAnalyticsPath(path: AnalyticsPath): any {
    return {
        _type: 'AnalyticsPath',
        segments: path.getSegments().map(segment => ({
            _type: 'AnalyticsPathSegment',
            ...segment
        }))
    };
}

function deserializeAnalyticsPath(obj: any): AnalyticsPath {
    if (obj._type === 'AnalyticsPath') {
        return new AnalyticsPath(obj.segments.map((s: any) => new AnalyticsPathSegment(s.name, s.filters)));
    }
    throw new Error('Invalid AnalyticsPath object');
}

export function serializeAnalyticsQuery(query: AnalyticsQuery): string {
    return JSON.stringify(query, (key, value) => {
      if (value instanceof Date) {
        return { _type: 'Date', value: value.toISOString() };
      }
      if (value instanceof AnalyticsPath) {
        return { _type: 'AnalyticsPath', value: value.toString() };
      }
      if (key === 'granularity') {
        return { _type: 'AnalyticsGranularity', value: value };
      }
      if (key === 'select') {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [
            k,
            Array.isArray(v) ? v.map(path => ({ _type: 'AnalyticsPath', value: path.toString() })) : v
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
        return AnalyticsPath.fromString(value.toString());
      }
      if (key === 'select' || key === 'lod') {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]: any) => [
            k,
            key === 'select'
              ? [AnalyticsPath.fromString(v[0].toString())]
              : Number(v)
          ])
        );
      }
      return value;
    });
  }