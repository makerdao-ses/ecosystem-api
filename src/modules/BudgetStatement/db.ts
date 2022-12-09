import { Knex } from "knex";

export interface BudgetStatement {
    id: string
    cuId: string
    month: string
    budgetStatus: string
    publicationUrl: string
    cuCode: string
    mkrProgramLength: number
    auditReport: object
    budgetStatementFTEs: object
    budgetStatementMKRVest: object
    budgetStatementWallet: object
}

export interface AuditReport {
    id: string
    budgetStatementId: string
    auditStatus: string
    reportUrl: string
    timestamp: string
}

export interface BudgetStatementFTEs {
    id: string
    budgetStatementId: string
    month: string
    ftes: number
}

export interface BudgetStatementMKRVest {
    id: string
    budgetStatementId: string
    vestingDate: string
    mkrAmount: number
    mkrAmountOld: number
    comments: string
}

export interface BudgetStatementWallet {
    id: string
    budgetStatementId: string
    name: string
    address: string
    currentBalance: number
    topupTransfer: number
    comments: string
    budgetStatementLineItem: object
    budgetStatementPayment: object
    budgetStatementTransferRequest: object
}

export interface BudgetStatementLineItem {
    id: string
    budgetStatementWalletId: string
    month: string
    position: number
    group: string
    budgetCategory: string
    forecast: number
    actual: number
    comments: string
    canonicalBudgetCategory: object
    headcountExpense: boolean
    budgetCap: number
    payment: number
}

export interface BudgetStatementPayment {
    id: string
    budgetStatementWalletId: string
    transactionDate: string
    transactionId: string
    budgetStatementLineItemId: number
    comments: string
}

export interface BudgetStatementTransferRequest {
    id: string
    budgetStatementWalletId: string
    budgetStatementPaymentId: string
    requestAmount: number
    comments: string
}

type lineItem = {
    id?: string
    budgetStatementWalletId: string
    month: string
    position: number | string
    group: string
    budgetCategory: string
    forecast: number | string
    actual: number | string
    comments: string
    canonicalBudgetCategory: string
    headcountExpense: boolean | string
    budgetCap: number | string
    payment: number | string
}

type FTE = {
    id?: string
    budgetStatementId: string,
    month: string,
    ftes: number
}

export interface BudgetStatementComment {
    id: string
    budgetStatementId: string
    timestamp: string
    comment: string
}

export interface BudgetStatementCommentAuthor {
    id: string
    name: string
}

export class BudgetStatementModel {
    knex: Knex;
    coreUnitModel: object;
    authModel: object;

    constructor(knex: Knex, coreUnitModel: object, authModel: object) {
        this.knex = knex;
        this.coreUnitModel = coreUnitModel;
        this.authModel = authModel;
    };

    async getBudgetStatements(limit: number | undefined, offset: number | undefined): Promise<BudgetStatement[]> {
        if (limit !== undefined && offset !== undefined) {
            return this.knex
                .select()
                .from('BudgetStatement')
                .limit(limit)
                .offset(offset)
                .orderBy('month', 'desc')
        } else {
            return this.knex
                .select('*')
                .from('BudgetStatement')
                .orderBy('month', 'desc')
        }
    };

    async getBudgetStatement(
        paramName: string,
        paramValue: number | string,
        secondParamName: string | undefined,
        secondParamValue: number | string | undefined): Promise<BudgetStatement[]> {
        if (secondParamName === undefined && secondParamValue === undefined) {
            return this.knex('BudgetStatement').where(`${paramName}`, paramValue);
        } else {
            return this.knex('BudgetStatement').where(`${paramName}`, paramValue).andWhere(`${secondParamName}`, secondParamValue)
        }
    };

    async getAuditReports(budgetStatementId: string | undefined): Promise<AuditReport[]> {
        if (budgetStatementId === undefined) {
            return this.knex
                .select('*')
                .from('AuditReport')
                .orderBy('id')
        } else {
            return this.knex('AuditReport').where(`budgetStatementId`, budgetStatementId)
        }
    };

    async getAuditReport(paramName: string, paramValue: string) {
        return this.knex('AuditReport').where(`${paramName}`, paramValue)
    };

    async getBudgetStatementFTEs(budgetStatementId: string | undefined): Promise<BudgetStatementFTEs[]> {
        if (budgetStatementId === undefined) {
            return this.knex
                .select('*')
                .from('BudgetStatementFtes')
                .orderBy('id')
        } else {
            return this.knex('BudgetStatementFtes').where(`budgetStatementId`, budgetStatementId)
        }
    };

    async getBudgetStatementFTE(paramName: string, paramValue: string | number) {
        return this.knex('BudgetStatementFtes').where(`${paramName}`, paramValue)
    };


    async getBudgetStatementMKRVests(budgetStatementId: string | undefined): Promise<BudgetStatementMKRVest[]> {
        if (budgetStatementId === undefined) {
            return this.knex
                .select('*')
                .from('BudgetStatementMkrVest')
                .orderBy('id');
        } else {
            return this.knex('BudgetStatementMkrVest').where('budgetStatementId', budgetStatementId)
        }
    };

    async getBudgetStatementMKRVest(paramName: string, paramValue: string | number): Promise<BudgetStatementMKRVest[]> {
        return this.knex('BudgetStatementMkrVest').where(`${paramName}`, paramValue)
    };

    async getBudgetStatementWallets(budgetStatementId: string | undefined): Promise<BudgetStatementWallet[]> {
        if (budgetStatementId === undefined) {
            return this.knex
                .select('*')
                .from('BudgetStatementWallet')
                .orderBy('id')
        } else {
            return this.knex('BudgetStatementWallet').where('budgetStatementId', budgetStatementId)
        }
    }

    async getBudgetStatementWallet(paramName: string, paramValue: string | number) {
        return this.knex('BudgetStatementWallet').where(`${paramName}`, paramValue)
    };

    async getBudgetStatementLineItems(limit: number | undefined, offset: number | undefined): Promise<BudgetStatementLineItem[]> {
        if (offset != undefined && limit != undefined) {
            return this.knex
                .select()
                .from('BudgetStatementLineItem')
                .limit(limit)
                .offset(offset)
                .orderBy('month', 'desc')
        } else {
            return this.knex
                .select('*')
                .from('BudgetStatementLineItem')
                .orderBy('month', 'desc')
        }
    };


    async getBudgetStatementLineItem(
        paramName: string,
        paramValue: string | number | boolean,
        secondParamName: string | undefined,
        secondParamValue: string | number | boolean | undefined): Promise<BudgetStatementLineItem[]> {
        if (secondParamName === undefined && secondParamValue === undefined) {
            return this.knex('BudgetStatementLineItem').where(`${paramName}`, paramValue).orderBy('month', 'desc')
        } else {
            return this.knex('BudgetStatementLineItem').where(`${paramName}`, paramValue).andWhere(`${secondParamName}`, secondParamValue)
        }
    };

    async getBudgetStatementPayments(budgetStatementWalletId: string | undefined): Promise<BudgetStatementPayment[]> {
        if (budgetStatementWalletId === undefined) {
            return this.knex
                .select('*')
                .from('BudgetStatementPayment')
                .orderBy('id');
        } else {
            return this.knex('BudgetStatementPayment').where('budgetStatementWalletId', budgetStatementWalletId)
        }

    };

    async getBudgetStatementPayment(paramName: string, paramValue: string | number): Promise<BudgetStatementPayment[]> {
        return this.knex('BudgetStatementPayment').where(`${paramName}`, paramValue)
    };

    async getBudgetStatementTransferRequests(budgetStatementWalletId: string | undefined): Promise<BudgetStatementTransferRequest[]> {
        if (budgetStatementWalletId === undefined) {
            return this.knex
                .select('*')
                .from('BudgetStatementTransferRequest')
                .orderBy('id')
        } else {
            return this.knex('BudgetStatementTransferRequest').where('budgetStatementWalletId', budgetStatementWalletId)
        }
    };

    async getBudgetStatementTransferRequest(paramName: string, paramValue: string | number): Promise<BudgetStatementTransferRequest[]> {
        return this.knex('BudgetStatementTransferRequest').where(`${paramName}`, paramValue)
    };

    async getBudgetStatementComments(budgetStatementId: string | undefined): Promise<BudgetStatementComment[]> {
        if (budgetStatementId === undefined) {
            return this.knex
                .select('*')
                .from('BudgetStatementComment')
                .orderBy('id')
        } else {
            return this.knex('BudgetStatementComment').where('budgetStatementId', budgetStatementId)
        }
    };

    async getBudgetStatementComment(
        paramName: string,
        paramValue: number | string,
        secondParamName: string | undefined,
        secondParamValue: number | string | undefined): Promise<BudgetStatementComment[]> {
        if (secondParamName === undefined && secondParamValue === undefined) {
            return this.knex('BudgetStatementComment').where(`${paramName}`, paramValue);
        } else {
            return this.knex('BudgetStatementComment').where(`${paramName}`, paramValue).andWhere(`${secondParamName}`, secondParamValue)
        }
    };

    async getBudgetStatementCommentAuthors(bsCommentId: string | undefined): Promise<BudgetStatementCommentAuthor[]> {
        if (bsCommentId === undefined) {
            return this.knex
                .select('*')
                .from('BudgetStatementCommentAuthor')
                .orderBy('id')
        } else {
            return this.knex('BudgetStatementCommentAuthor').where('bsCommentId', bsCommentId)
        }
    };

    async getBudgetStatementCommentAuthor(paramName: string,
        paramValue: number | string,
        secondParamName: string | undefined,
        secondParamValue: number | string | undefined): Promise<BudgetStatementCommentAuthor[]> {
        if (secondParamName === undefined && secondParamValue === undefined) {
            return this.knex('BudgetStatementCommentAuthor').where(`${paramName}`, paramValue);
        } else {
            return this.knex('BudgetStatementCommentAuthor').where(`${paramName}`, paramValue).andWhere(`${secondParamName}`, secondParamValue)
        }
    };

    async getBsComment_BsAuthor(bsCommentId: string): Promise<any> {
        return this.knex('BudgetStatementComment_BudgetStatementCommentAuthor').where('bsCommentId', bsCommentId);
    }

    // ------------------- Adding data --------------------------------

    async addBatchtLineItems(rows: object[]) {
        const chunkSize = rows.length;
        return this.knex.batchInsert('BudgetStatementLineItem', rows, chunkSize).returning('*');
    };

    async addBatchBudgetStatements(rows: object[]) {
        const chunkSize = rows.length;
        return this.knex.batchInsert('BudgetStatement', rows, chunkSize).returning('*');
    };

    async addBudgetStatementWallets(rows: object[]) {
        const chunkSize = rows.length;
        return this.knex.batchInsert('BudgetStatementWallet', rows, chunkSize).returning('*');
    };

    async addBudgetStatementFTE(input: FTE) {
        return this.knex('BudgetStatementFtes').insert({ budgetStatementId: input.budgetStatementId, month: input.month, ftes: input.ftes }).returning('*')
    };

    async addBudgetStatementCommentAuthor(name: string): Promise<BudgetStatementCommentAuthor[]> {
        return this.knex('BudgetStatementCommentAuthor').insert({ name }).returning('*');
    }

    async addBudgetStatementComment(authorId: number, budgetStatementId: number, comment: string): Promise<BudgetStatementComment[]> {
        return this.knex('BudgetStatementComment').insert({ authorId, budgetStatementId, timestamp: new Date().toISOString(), comment }).returning('*');
    }

    async addCommentAuthor(bsCommentId: number, bsCommentAuthorId: number) {
        await this.knex('BudgetStatementComment_BudgetStatementCommentAuthor').insert({ bsCommentId, bsCommentAuthorId })
    }
    // ------------------- Updating data --------------------------------

    async updateLineItem(lineItem: lineItem) {
        const id = lineItem.id;
        delete lineItem.id;
        return this.knex('BudgetStatementLineItem').where('id', id).update(lineItem).returning('*');
    }

    async updateBudgetStatementFTE(input: FTE) {
        const id = input.id;
        delete input.id;
        return this.knex('BudgetStatementFtes').where('id', id).update(input).returning('*')
    }

    async batchUpdateLineItems(lineItems: lineItem[]) {
        const trx = await this.knex.transaction();
        try {
            const result = await Promise.all(lineItems.map(lineItem => {
                let id = lineItem.id;
                delete lineItem.id
                return this.knex('BudgetStatementLineItem')
                    .where('id', id)
                    .update(lineItem)
                    .transacting(trx)
                    .returning('*')
            }));
            await trx.commit()
            return result.flat();
        } catch (error) {
            await trx.rollback()
        }
    }

    async batchDeleteLineItems(lineItems: lineItem[]) {
        const trx = await this.knex.transaction();
        try {
            const result = await Promise.all(lineItems.map(lineItem => {
                let id = lineItem.id;
                delete lineItem.id
                return this.knex('BudgetStatementLineItem')
                    .where('id', id)
                    .del(lineItem as any)
                    .transacting(trx)
                    .returning('*')
            }));
            await trx.commit()
            return result.flat();
        } catch (error) {
            await trx.rollback()
        }
    };

    async budgetStatementCommentDelete(commentId: number) {
        await this.knex("BudgetStatementComment_BudgetStatementCommentAuthor").where('bsCommentId', commentId).del();
        return await this.knex('BudgetStatementComment').where('id', commentId).del().returning('*');
    }
};

export default (knex: Knex, deps: { [key: string]: object }) => new BudgetStatementModel(knex, deps['CoreUnit'], deps['Auth'])