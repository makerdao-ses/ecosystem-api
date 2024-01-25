import { Knex } from 'knex';

export const convertDate = (dateString: string) => {
    const [year, month] = dateString.split('-');

    const formattedDate = `${year}/${month}`;

    return formattedDate;
};

export const getAnalyticsActuals = async (queryEngine: any, monthAndDay: string, ownerType: string, teamId: number) => {

    const filter = {
        start: "2020/01",
        end: "2100/01",
        granularity: 'total',
        metrics: ['Actuals'],
        dimensions: [
            { name: 'report', select: `atlas/${ownerType}/${teamId}/${monthAndDay}`, lod: 5 }
        ],
        currency: 'DAI'
    }
    const results = await queryEngine.query(filter);

    const result = results.map((s: any) => ({
        actuals: s.rows.find((r: any) => r.metric == 'Actuals')?.value,
    }))
    return result;
}

export const getAnalyticsForecast = async (queryEngine: any, monthAndDay: string, ownerType: string, teamId: number) => {

    const filter = {
        start: "2020/01",
        end: "2100/01",
        granularity: 'total',
        metrics: ['Forecast'],
        dimensions: [
            { name: 'report', select: `atlas/${ownerType}/${teamId}/${monthAndDay}`, lod: 5 }
        ],
        currency: 'DAI'
    }
    const results = await queryEngine.query(filter);

    const result = results.map((s: any) => ({
        forecast: s.rows.find((r: any) => r.metric == 'Forecast')?.value
    }))
    return result;
}

export const getAnalyticsOnChain = async (queryEngine: any, monthAndDay: string, ownerType: string, teamId: number) => {

    const filter = {
        start: "2020/01",
        end: "2100/01",
        granularity: 'total',
        metrics: ['PaymentsOnChain'],
        dimensions: [
            { name: 'report', select: `atlas/${ownerType}/${teamId}/${monthAndDay}`, lod: 5 }
        ],
        currency: 'DAI'
    }
    const results = await queryEngine.query(filter);

    const result = results.map((s: any) => ({
        paymentsOnChain: s.rows.find((r: any) => r.metric == 'PaymentsOnChain')?.value,
    }))
    return result;
}

export const getAnalyticsOffChain = async (queryEngine: any, monthAndDay: string, ownerType: string, teamId: number) => {

    const filter = {
        start: "2020/01",
        end: "2100/01",
        granularity: 'total',
        metrics: ['PaymentsOffChainIncluded'],
        dimensions: [
            { name: 'report', select: `atlas/${ownerType}/${teamId}/${monthAndDay}`, lod: 5 }
        ],
        currency: 'DAI'
    }
    const results = await queryEngine.query(filter);

    const result = results.map((s: any) => ({
        paymentsOffChain: s.rows.find((r: any) => r.metric == 'PaymentsOffChainIncluded')?.value,
    }))
    return result;
}

export const getOwnerFromBudgetPath = async (path: string, knex: Knex) => {
    // get list of teams
    const teamsResult = await knex('CoreUnit').where('type', 'EcosystemActor').select('id', 'shortCode');
    const cusResult = await knex('CoreUnit').where('type', 'CoreUnit').select('id', 'code');
    const pathArray = path.split('/');

    // check if coreUnit exists in the path
    const coreUnitRule = ['atlas', 'legacy', 'core-units']
    const coreUnitexists = coreUnitRule.every(item => pathArray.includes(item))
    if (coreUnitexists && pathArray.length > 3) {
        // remove empty string from array
        const filteredArray = pathArray.filter(item => item !== '');
        const owner = filteredArray[filteredArray.length - 1];
        const {id} = cusResult.find((item: any) => item.code === owner);
        return { ownerType: 'CoreUnit', owner, ownerId: id };
    }

    // check for recognized delegates
    const delegateRule = ['atlas', 'legacy', 'recognized-delegates']
    const delegateExists = delegateRule.every(item => pathArray.includes(item))
    if (delegateExists) {
        // remove empty string from array
        return { ownerType: 'Delegate', owner: null, ownerId: null };
    }

    // check for if only atlas exists in the path
    const atlasRule = ['atlas']
    const atlasExists = atlasRule.every(item => pathArray.includes(item))
    if (pathArray.length <= 2 && atlasExists) {
        return { ownerType: null, owner: null, ownerId: null };
    }

    // check for ecosystem actors
    let ecosystemActor = false;
    teamsResult.forEach((item: any) => {
        if (pathArray.includes(item.shortCode)) {
            ecosystemActor = true;
        }
    });
    if (path.startsWith('atlas/scopes') && ecosystemActor) {
        const filteredArray = pathArray.filter(item => item !== '');
        const owner = filteredArray[filteredArray.length - 1];
        const {id} = teamsResult.find((item: any) => item.shortCode === owner);
        return { ownerType: 'EcosystemActor', owner, ownerId: id };
    }

    return { ownerType: null, owner: null, ownerId: null };

}
