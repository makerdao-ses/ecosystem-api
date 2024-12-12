import { Knex } from 'knex';
import { addMonths, subMonths, parse, format } from 'date-fns';

// Helper function to adjust dates
const adjustDates = (yearMonth: string) => {
    const date = parse(yearMonth, 'yyyy/MM', new Date());
    const start = format(subMonths(date, 5), 'yyyy/MM');
    const end = format(addMonths(date, 5), 'yyyy/MM');
    return { start, end };
};

export const convertDate = (dateString: string) => {
    const [year, month] = dateString.split('-');

    const formattedDate = `${year}/${month}`;

    return formattedDate;
};

export const getAnalyticsActuals = async (queryEngine: any, yearMonth: string, ownerType: string, teamId: number) => {
    const { start, end } = adjustDates(yearMonth);

    const filter = {
        start,
        end,
        granularity: 'total',
        metrics: ['Actuals'],
        dimensions: [
            { name: 'report', select: `atlas/${ownerType}/${teamId}/${yearMonth}`, lod: 5 }
        ],
        currency: 'DAI'
    }
    const results = await queryEngine.query(filter, 'critical');

    const result = results.map((s: any) => ({
        actuals: s.rows.find((r: any) => r.metric == 'Actuals')?.value,
    }))
    return result;
}

export const getAnalyticsForecast = async (queryEngine: any, yearMonth: string, ownerType: string, teamId: number) => {
    const { start, end } = adjustDates(yearMonth);

    const filter = {
        start,
        end,
        granularity: 'total',
        metrics: ['Forecast'],
        dimensions: [
            { name: 'report', select: `atlas/${ownerType}/${teamId}/${yearMonth}`, lod: 5 }
        ],
        currency: 'DAI'
    }
    const results = await queryEngine.query(filter, 'critical');

    const result = results.map((s: any) => ({
        forecast: s.rows.find((r: any) => r.metric == 'Forecast')?.value
    }))
    return result;
}

export const getAnalyticsOnChain = async (queryEngine: any, yearMonth: string, ownerType: string, teamId: number) => {
    const { start, end } = adjustDates(yearMonth);

    const filter = {
        start,
        end,
        granularity: 'total',
        metrics: ['PaymentsOnChain'],
        dimensions: [
            { name: 'report', select: `atlas/${ownerType}/${teamId}/${yearMonth}`, lod: 5 }
        ],
        currency: 'DAI'
    }
    const results = await queryEngine.query(filter, 'critical');

    const result = results.map((s: any) => ({
        paymentsOnChain: s.rows.find((r: any) => r.metric == 'PaymentsOnChain')?.value,
    }))
    return result;
}

export const getAnalyticsNetOutflow = async (queryEngine: any, yearMonth: string, ownerType: string, teamId: number) => {
    const { start, end } = adjustDates(yearMonth);

    const filter = {
        start,
        end,
        granularity: 'total',
        metrics: ['ProtocolNetOutflow'],
        dimensions: [
            { name: 'report', select: `atlas/${ownerType}/${teamId}/${yearMonth}`, lod: 5 }
        ],
        currency: 'DAI'
    }
    const results = await queryEngine.query(filter, 'critical');

    const result = results.map((s: any) => ({
        netProtocolOutflow: s.rows.find((r: any) => r.metric == 'ProtocolNetOutflow')?.value,
    }))
    return result;
}

export const getAnalyticsOffChain = async (queryEngine: any, yearMonth: string, ownerType: string, teamId: number) => {
    const { start, end } = adjustDates(yearMonth);

    const filter = {
        start,
        end,
        granularity: 'total',
        metrics: ['PaymentsOffChainIncluded'],
        dimensions: [
            { name: 'report', select: `atlas/${ownerType}/${teamId}/${yearMonth}`, lod: 5 }
        ],
        currency: 'DAI'
    }
    const results = await queryEngine.query(filter, 'critical');

    const result = results.map((s: any) => ({
        paymentsOffChain: s.rows.find((r: any) => r.metric == 'PaymentsOffChainIncluded')?.value,
    }))
    return result;
}

export const resolveBudgetPath = async (path: string, knex: Knex) => {
    let query = knex('BudgetPathMap').select('budgetStatementId');

    // Escape single quotes in path
    // include / at the end to ensure we are matching the full path
    path = path.endsWith('/') ? path : `${path}/`;
    const escapedPath = path.replace(/'/g, "''");
    query = query.where('path', 'like', `${escapedPath}%`);

    const result = await query;
    return result.map((item: any) => item.budgetStatementId);
}
