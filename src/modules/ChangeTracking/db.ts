import { Knex } from "knex";

export interface ChangeTrackingEvent {
    id: string;
    created_at: string;
    event: string;
    params: object;
    description: string;
}

export interface UserActivity {
    id: string;
    userId: string;
    collection: string;
    data: JSON;
    lastVisit: string;
}

export class ChangeTrackingModel {
    knex: Knex;
    coreUnitModel: object;

    constructor(knex: Knex, coreUnitModel: object) {
        this.knex = knex;
        this.coreUnitModel = coreUnitModel;
    }

    private toMonthName(monthNumber: number) {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', {
            month: 'long',
        });
    }

    async getActivityFeed(limit: number | undefined, offset: number | undefined): Promise<ChangeTrackingEvent[]> {
        if (offset != undefined && limit != undefined) {
            return await this.knex.select('*')
                .from('ChangeTrackingEvents')
                .limit(limit)
                .offset(offset)
                .orderBy('id', 'desc');
        } else {
            return await this.knex.select('*')
                .from('ChangeTrackingEvents')
                .orderBy('id', 'desc');
        }

    }

    async getCoreUnitActivityFeed(cuId: string): Promise<ChangeTrackingEvent[]> {
        return await this.knex('ChangeTrackingEvents_Index')
            .where('objectId', cuId)
            .orderBy('eventId', 'desc')
            .join('ChangeTrackingEvents', 'ChangeTrackingEvents_Index.eventId', '=', 'ChangeTrackingEvents.id');
    }

    async getCoreUnitLastActivity(cuId: string): Promise<ChangeTrackingEvent | null> {
        const result = await this.knex('ChangeTrackingEvents_Index')
            .where('objectId', cuId)
            .join('ChangeTrackingEvents', 'ChangeTrackingEvents_Index.eventId', '=', 'ChangeTrackingEvents.id')
            .orderBy('ChangeTrackingEvents.created_at', 'desc')
            .limit(1);
        return result[0]
    }

    async getBsEvents(bsId: string) {
        return await this.knex.select('*').from('ChangeTrackingEvents')
            .whereRaw('params->>? = ?', ['budgetStatementId', JSON.parse(bsId)])
            .orderBy('ChangeTrackingEvents.id', 'desc');
    }

    async coreUnitBudgetStatementCreated(cuId: string, cuCode: string, cuShortCode: string, budgetStatementId: string, month: string) {
        const monthDate = new Date(month);
        const event = {
            created_at: new Date().toISOString(),
            event: 'CU_BUDGET_STATEMENT_CREATED',
            params: JSON.stringify({ coreUnit: { id: cuId, code: cuCode, shortCode: cuShortCode }, budgetStatementId, month: monthDate.toISOString().slice(0, 7) }),
            description: `Core Unit ${cuShortCode} has published a new expense report for ${this.toMonthName(Number(monthDate.toISOString().slice(5, 7)))} ${monthDate.getFullYear()}`
        }

        const result = await this.knex('ChangeTrackingEvents').insert({ created_at: event.created_at, event: event.event, params: event.params, description: event.description }).returning('*')
        let [lastIndex] = await this.knex('ChangeTrackingEvents_Index').select('id').orderBy('id', 'desc').limit(1);
        await this.knex('ChangeTrackingEvents_Index').insert({ id: parseInt(lastIndex.id) + 1, eventId: result[0].id, objectType: 'CoreUnit', objectId: cuId })
    }

    async coreUnitBudgetStatementUpdated(cuId: string, cuCode: string, cuShortCode: string, budgetStatementId: string, month: string) {
        const monthDate = new Date(month);
        const event = {
            created_at: new Date().toISOString(),
            event: 'CU_BUDGET_STATEMENT_UPDATED',
            params: JSON.stringify({ coreUnit: { id: cuId, code: cuCode, shortCode: cuShortCode }, budgetStatementId, month: monthDate.toISOString().slice(0, 7) }),
            description: `Core Unit ${cuShortCode} has updated their expense report for ${this.toMonthName(Number(monthDate.toISOString().slice(5, 7)))} ${monthDate.getFullYear()}`
        }

        const result = await this.knex('ChangeTrackingEvents').insert({ created_at: event.created_at, event: event.event, params: event.params, description: event.description }).returning('*')
        let [lastIndex] = await this.knex('ChangeTrackingEvents_Index').select('id').orderBy('id', 'desc').limit(1);
        await this.knex('ChangeTrackingEvents_Index').insert({ id: parseInt(lastIndex.id) + 1, eventId: result[0].id, objectType: 'CoreUnit', objectId: cuId })
    }

    async budgetStatementCommentUpdate(
        description: string,
        cuId: string,
        cuCode: string,
        shortCode: string,
        budgetStatementId: string,
        month: string,
        authorId: string,
        username: string,
        commentId: string,
        oldStatus: string,
        newStatus: string
    ) {
        const event = {
            created_at: new Date().toISOString(),
            event: 'CU_BUDGET_STATEMENT_COMMENT',
            description: description,
            params: JSON.stringify({
                coreUnit: {
                    id: cuId,
                    code: cuCode,
                    shortCode: shortCode
                },
                budgetStatementId: budgetStatementId,
                month: month.substring(0, month.length - 3),
                author: {
                    id: authorId,
                    username: username,
                },
                commentId: commentId,
                status: {
                    old: oldStatus,
                    new: newStatus
                }
            })
        };
        const result = await this.knex('ChangeTrackingEvents').insert({ created_at: event.created_at, event: event.event, params: event.params, description: event.description }).returning('*')
        let [lastIndex] = await this.knex('ChangeTrackingEvents_Index').select('id').orderBy('id', 'desc').limit(1);
        await this.knex('ChangeTrackingEvents_Index').insert({ id: parseInt(lastIndex.id) + 1, eventId: result[0].id, objectType: 'BudgetStatement', objectId: budgetStatementId })
        await this.knex('ChangeTrackingEvents_Index').insert({ id: parseInt(lastIndex.id) + 2, eventId: result[0].id, objectType: 'CoreUnit', objectId: cuId })

    }

    async getUserActivity(
        paramName: string | undefined,
        paramValue: string | number | undefined,
        secondParamName: string | undefined,
        secondParamValue: string | undefined) {
        if (paramName === undefined && paramValue === undefined && secondParamName === undefined && secondParamValue === undefined) {
            return this.knex('UserActivity').orderBy('id', 'desc').limit(1);
        } else if (secondParamName == undefined && secondParamValue == undefined) {
            return this.knex('UserActivity').where(`${paramName}`, paramValue).orderBy('id', 'desc').limit(1);
        } else {
            return this.knex('UserActivity').where(`${paramName}`, paramValue).andWhere(`${secondParamName}`, secondParamValue).orderBy('id', 'desc').limit(1);
        }
    };

    async userActivityCreate(input: { userId: string | undefined, collection: string, data: JSON | undefined, timestamp: string }) {
        return this.knex('UserActivity').insert({ userId: input.userId, collection: input.collection, data: input.data, lastVisit: input.timestamp }).returning('*')
    }
}

export default (knex: Knex, deps: { [key: string]: object }) => new ChangeTrackingModel(knex, deps['CoreUnit']);