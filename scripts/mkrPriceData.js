import knex from 'knex';

export default class PriceDataScript {

    db;

    constructor() {
        this.db = knex({
            client: 'pg',
            connection: process.env.PG_CONNECTION_STRING,
        });
    }

    async run() {
        try {
            await this.insertMkrPriceData();
            process.exit(1)
        } catch (error) {
            console.error(error);
            process.exit(1)
        }
    }

    async insertMkrPriceData() {
        const days = await this.determineStartDate();
        const mkrPriceData = await this.getMkrPriceData(days);
        const filteredMkrPriceData = await this.filterMkrPriceData(mkrPriceData);

        if (filteredMkrPriceData.length === 0) {
            console.log('No new data to insert');
        } else {
            console.log(`Inserting ${days} days of MKR price data`);
            await this.db('PriceData').insert(filteredMkrPriceData.map((data) => ({ ...data, end: this.addOneDay(data.start), market: 'MKR.USD', metric: 'DAY_AVERAGE' })));
        }

    }

    async filterMkrPriceData(mkrPriceData) {
        const [dbDate] = await this.getLatestMkrPriceDatafromDB();
        if (!dbDate) return mkrPriceData;
        return mkrPriceData.filter((data) => data.start.getDay() !== dbDate.start.getDay() && data.start.getHours() === 0);
    }

    addOneDay(date) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
    }

    async getMkrPriceData(days) {
        const url = `https://api.coingecko.com/api/v3/coins/maker/market_chart?vs_currency=usd&days=${days}&interval=daily`;
        const response = await fetch(url);
        const data = await response.json();
        return data.prices.map(([start, price]) => ({ start: new Date(start), price }));
    }

    async determineStartDate() {
        const [dbDate] = await this.getLatestMkrPriceDatafromDB();
        if (dbDate) {
            return this.calculateDays(new Date(dbDate.start), new Date());
        } else {
            return this.calculateDays(new Date('2021-01-01'), new Date())
        }
    }

    async getLatestMkrPriceDatafromDB() {
        return await this.db.select('start').from('PriceData').where('market', 'MKR.USD').orderBy('id', 'desc').limit(1);
    }

    calculateDays(start, end) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
}

new PriceDataScript().run();