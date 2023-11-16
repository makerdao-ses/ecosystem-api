export class QueryParams {
  private input: Record<string, any>;

  constructor(input?: Record<string, any>) {
    this.input = input || {};
  }

  has(paramName: string) {
    return this.input[paramName] !== undefined;
  }

  get<T>(paramName: string, defaultValue: T | null = null): T | null {
    return this.has(paramName) ? (this.input[paramName] as T) : defaultValue;
  }
}
