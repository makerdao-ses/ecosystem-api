import { Knex } from "knex";

export interface CuMip {
    id: string
    mipCode: string
    cuId: string
    rfc: string
    formalSubmission: string
    accepted: string
    rejected: string
    obsolete: string
    mipStatus: string
    mipUrl: string
    mipTitle: string
    forumUrl: string
    mip39: object
    mip40: object
    mip41: object
    mipReplaces: object
};

export interface MipReplaces {
    id: string
    newMip: string
    replacedMip: string
}

export interface Mip39 {
    id: string
    mipId: string
    mip39Spn: number
    mipCode: string
    cuName: string
    sentenceSummary: string
    paragraphSummary: string
}

export interface Mip40 {
    id: string
    cuMipId: string
    mip40Spn: string
    mkrOnly: boolean
    mkrProgramLength: number
    mip40BudgetPeriod: object
    mip40Wallet: object
}

export interface Mip40BudgetPeriod {
    id: string
    mip40Id: string
    budgetPeriodStart: string
    budgetPeriodEnd: string
    ftes: number
}

export interface Mip40Wallet {
    id: string
    mip40Id: string
    address: string
    name: string
    signersTotal: number
    signersRequired: number
    clawbackLimit: number
    mip40BudgetLineItem: object
}

export interface Mip40BudgetLineItem {
    id: string
    mip40WalletId: string
    position: number
    budgetCategory: string
    budgetCap: number
    canonicalBudgetCategory: string
    group: string
    headcountExpense: boolean
}

export interface Mip41 {
    id: string
    cuMipId: string
    contributorId: string
}

export interface CuMipFilter {
    id?: number
    mipCode?: string
    cuId?: number
    rfc?: string
    formalSubmission?: string
    accepted?: string
    rejected?: string
    obsolete?: string
    mipStatus?: string
}

export interface MipReplaceFilter {
    id?: number
    newMip?: number
    replacedMip?: number
}

export interface Mip39Filter {
    id?: number
    mipId?: number
    mip39Spn?: number
    mipCode?: string
    cuName?: string
    sentenceSummary?: string
    paragraphSummary?: string
}

export interface Mip40Filter {
    id?: number
    cuMipId?: number
    mip40Spn?: string
    mkrOnly?: boolean
    mkrProgramLength?: number
}

export interface Mip40BudgetPeriodFilter {
    id?: number
    mip40Id?: number
    budgetPeriodStart?: string
    budgetPeriodEnd?: string
    ftes?: number
}

export interface Mip40BudgetLineItemFilter {
    id?: number
    mip40WalletId?: number
    position?: number
    budgetCategory?: string
    budgetCap?: number
    canonicalBudgetCategory?: string
    group?: string
    headcountExpense?: boolean
}

export class MipModel {
    knex: Knex;
    coreUnitModel: object;

    constructor(knex: Knex, coreUnitModel: object) {
        this.knex = knex;
        this.coreUnitModel = coreUnitModel;
    }

    async getMips(filter?: CuMipFilter): Promise<CuMip[]> {
        const baseQuery = this.knex
            .select('*')
            .from('CuMip')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.mipCode !== undefined) {
            return baseQuery.where('mipCode', filter.mipCode)
        } else if (filter?.cuId !== undefined) {
            return baseQuery.where('cuId', filter.cuId)
        } else if (filter?.rfc !== undefined) {
            return baseQuery.where('rfc', filter.rfc)
        } else if (filter?.formalSubmission !== undefined) {
            return baseQuery.where('formalSubmission', filter.formalSubmission)
        } else if (filter?.accepted !== undefined) {
            return baseQuery.where('accepted', filter.accepted)
        } else if (filter?.rejected !== undefined) {
            return baseQuery.where('rejected', filter.rejected)
        } else if (filter?.obsolete !== undefined) {
            return baseQuery.where('obsolete', filter.obsolete)
        } else if (filter?.mipStatus !== undefined) {
            return baseQuery.where('mipStatus', filter.mipStatus)
        } else {
            return baseQuery;
        }
    };

    async getMip(paramName: string, paramValue: string): Promise<CuMip[]> {
        return this.knex('CuMip').where(`${paramName}`, paramValue)
    };

    async getMipReplaces(filter?: MipReplaceFilter): Promise<MipReplaces[]> {
        const baseQuery = this.knex
            .select('*')
            .from('MipReplaces')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.newMip !== undefined) {
            return baseQuery.where('newMip', filter.newMip)
        } else if (filter?.replacedMip !== undefined) {
            return baseQuery.where('replacedMip', filter.replacedMip)
        } else {
            return baseQuery;
        }
    };

    async getMipReplace(paramName: string, paramValue: string): Promise<MipReplaces[]> {
        return this.knex('MipReplaces').where(`${paramName}`, paramValue);
    };

    async getMip39s(filter?: Mip39Filter): Promise<Mip39[]> {
        const baseQuery = this.knex
            .select('*')
            .from('Mip39')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.mipId !== undefined) {
            return baseQuery.where('mipId', filter.mipId)
        } else if (filter?.mip39Spn !== undefined) {
            return baseQuery.where('mip39Spn', filter.mip39Spn)
        } else if (filter?.mipCode !== undefined) {
            return baseQuery.where('mipCode', filter.mipCode)
        } else if (filter?.cuName !== undefined) {
            return baseQuery.where('cuName', filter.cuName)
        } else if (filter?.sentenceSummary !== undefined) {
            return baseQuery.where('sentenceSummary', filter.sentenceSummary)
        } else if (filter?.paragraphSummary !== undefined) {
            return baseQuery.where('paragraphSummary', filter.paragraphSummary)
        } else {
            return baseQuery;
        }
    };

    async getMip39(paramName: string, paramValue: number | string) {
        return this.knex('Mip39').where(`${paramName}`, paramValue)
    };

    async getMip40s(filter?: Mip40Filter): Promise<Mip40[]> {
        const baseQuery = this.knex
            .select('*')
            .from('Mip40')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.cuMipId !== undefined) {
            return baseQuery.where('cuMipId', filter.cuMipId)
        } else if (filter?.mip40Spn !== undefined) {
            return baseQuery.where('mip40Spn', filter.mip40Spn)
        } else if (filter?.mkrOnly !== undefined) {
            return baseQuery.where('mkrOnly', filter.mkrOnly)
        } else if (filter?.mkrProgramLength !== undefined) {
            return baseQuery.where('mkrProgramLength', filter.mkrProgramLength)
        } else {
            return baseQuery;
        }
    };

    async getMip40(paramName: string, paramValue: string | number | boolean | object): Promise<Mip40[]> {
        return this.knex('Mip40').where(`${paramName}`, paramValue)
    };

    async getMip40BudgetPeriods(filter: Mip40BudgetPeriodFilter): Promise<Mip40BudgetPeriod[]> {
        const baseQuery = this.knex
            .select('*')
            .from('Mip40BudgetPeriod')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.mip40Id !== undefined) {
            return baseQuery.where('mip40Id', filter.mip40Id);
        } else if (filter?.budgetPeriodStart !== undefined) {
            return baseQuery.where('budgetPeriodStart', filter.budgetPeriodStart)
        } else if (filter?.budgetPeriodEnd !== undefined) {
            return baseQuery.where('budgetPeriodEnd', filter.budgetPeriodEnd)
        } else if (filter?.ftes !== undefined) {
            return baseQuery.where('ftes', filter.ftes)
        } else {
            return baseQuery;
        }
    };

    async getMip40BudgetPeriod(paramName: string, paramValue: string | number): Promise<Mip40BudgetPeriod[]> {
        return this.knex('Mip40BudgetPeriod').where(`${paramName}`, paramValue)
    };

    async getMip40Wallets(mip40Id: string | undefined): Promise<Mip40Wallet[]> {
        if (mip40Id === undefined) {
            return this.knex
                .select('*')
                .from('Mip40Wallet')
                .orderBy('id');
        } else {
            return this.knex('Mip40Wallet').where('mip40Id', mip40Id)
        }
    };

    async getMip40Wallet(paramName: string, paramValue: string | number | object): Promise<Mip40Wallet[]> {
        return this.knex('Mip40Wallet').where(`${paramName}`, paramValue)
    };

    async getMip40BudgetLineItems(filter?: Mip40BudgetLineItemFilter): Promise<Mip40BudgetLineItem[]> {
        const baseQuery = this.knex
            .select('*')
            .from('Mip40BudgetLineItem')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.mip40WalletId !== undefined) {
            return baseQuery.where('mip40WalletId', filter.mip40WalletId)
        } else if (filter?.position !== undefined) {
            return baseQuery.where('position', filter.position)
        } else if (filter?.budgetCategory !== undefined) {
            return baseQuery.where('budgetCategory', filter.budgetCategory)
        } else if (filter?.budgetCap !== undefined) {
            return baseQuery.where('budgetCap', filter.budgetCap)
        } else if (filter?.canonicalBudgetCategory !== undefined) {
            return baseQuery.where('canonicalBudgetCategory', filter.canonicalBudgetCategory)
        } else if (filter?.group !== undefined) {
            return baseQuery.where('group', filter.group)
        } else if (filter?.headcountExpense !== undefined) {
            return baseQuery.where("headcountExpense", filter.headcountExpense)
        } else {
            return baseQuery;
        }
    };

    async getMip40BudgetLineItem(paramName: string, paramValue: number | string | boolean) {
        return this.knex('Mip40BudgetLineItem').where(`${paramName}`, paramValue)
    };

    async getMip41s(cuMipId: string | undefined): Promise<Mip41[]> {
        if (cuMipId === undefined) {
            return this.knex
                .select('*')
                .from('Mip41')
                .orderBy('id');
        } else {
            return this.knex('Mip41').where('cuMipId', cuMipId)
        }
    };

    async getMip41(paramName: string, paramValue: string): Promise<Mip41[]> {
        return this.knex('Mip41').where(`${paramName}`, paramValue)
    };

};

export default (knex: Knex, deps: { [key: string]: object }) => new MipModel(knex, deps['CoreUnit']);