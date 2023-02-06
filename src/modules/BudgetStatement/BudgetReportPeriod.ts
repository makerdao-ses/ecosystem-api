export enum BudgetReportPeriodType {
    Year,
    Quarter,
    Month
}

export class BudgetReportPeriod {
    get type(): BudgetReportPeriodType { return this._type; }
    get year(): number { return this._year; }
    get quarter(): number | null { return this._quarter; }
    get month(): number | null { return this._month; }

    private _type: BudgetReportPeriodType = BudgetReportPeriodType.Year;
    private _year: number = 1970;
    private _quarter: number | null = null;
    private _month: number | null = null;
    
    public static fromString(period:string): BudgetReportPeriod {
        let result:BudgetReportPeriod;

        if (period.length === 4) {
            result = new BudgetReportPeriod(Number.parseInt(period));
        
        } else if (period.length === 7) {
            if (period[4] !== '/') {
                throw new Error(`Invalid period string: '${period}'`);        
            
            } else if (period[5] === 'Q') {
                result = new BudgetReportPeriod(
                    Number.parseInt(period.slice(0, 4)),
                    Number.parseInt(period[6])
                );

            } else {
                result = new BudgetReportPeriod(
                    Number.parseInt(period.slice(0, 4)),
                    undefined,
                    Number.parseInt(period.slice(5))
                );
            }

        } else {
            throw new Error(`Invalid period string: '${period}'`);
        }

        return result;
    }

    public constructor(year: number, quarter?: number, month?: number) {
        this._initAsYear(year);

        if (quarter !== undefined) {
            this._initAsQuarter(quarter);
        }

        if (month !== undefined) {
            this._initAsMonth(month);
        }
    }

    public equals(period: BudgetReportPeriod | string): boolean {
        return this.toString() === (typeof period === 'string' ? period : period.toString()); 
    }

    public toString():string {
        let result = this._year + (this._type === BudgetReportPeriodType.Year ? "" : "/");
        
        if (this._type === BudgetReportPeriodType.Quarter) {
            result += "Q" + this._quarter;

        } else if (this._type === BudgetReportPeriodType.Month) {
            if (this._month as number < 10) {
                result += "0";
            }
            result += this._month
        }

        return result;
    }

    private _initAsYear(year: number) {
        if (year < 1970 || year > 2100) {
            throw new Error(`Invalid period year: '${year}'`);
        }

        this._year = year;
    }

    private _initAsQuarter(quarter: number) {
        if (quarter < 1 || quarter > 4) {
            throw new Error(`Invalid period quarter: ${quarter}`);
        }

        this._quarter = quarter;
        this._type = BudgetReportPeriodType.Quarter;
    }

    private _initAsMonth(month: number) {
        if (month < 1 || month > 12) {
            throw new Error(`Invalid period month: ${month}`);
        }

        if (this.quarter == null) {
            this._initAsQuarter(Math.floor((month - 1) / 3) + 1);
        } else if (this.quarter !== Math.floor((month - 1) / 3) + 1) {
            throw new Error(`Period month ${month} outside of quarter ${this.quarter}`);
        }

        this._month = month;
        this._type = BudgetReportPeriodType.Month;
    }
}
