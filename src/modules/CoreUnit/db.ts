import { Knex } from "knex";

export interface CoreUnit {
    id: string
    code: string
    name: string
    image: string
    category: object
    sentenceDescription: string
    paragraphDescription: string
    paragraphImage: string
    shortCode: string
    socialMediaChannels: object
    contributorCommitment: object
    cuGithubContribution: object
    cuUpdates: object
}

export interface CuUpdate {
    id: string
    cuId: string
    updateTitle: string
    updateDate: string
    updateUrl: string
}

export interface SocialMediaChannels {
    id: string
    cuCode: string
    forumTag: string
    twitter: string
    youtube: string
    discord: string
    linkedIn: string
    website: string
    github: string
}

export interface ContributorCommitment {
    id: string
    cuId: string
    contributorId: string
    startDate: string
    commitment: string
    cuCode: string
    contributor: object
    jobTitle: string
}

export interface CuGithubContribution {
    id: string
    cuId: string
    orgId: string
    repoId: string
    githubOrg: object
    githubRepo: object
}

export interface Contributor {
    id: string
    name: string
    forumHandle: string
    discordHandle: string
    twitterHandle: string
    email: string
    facilitatorImage: string
    githubUrl: string
}

export interface GithubOrg {
    id: string
    org: string
    githubUrl: string
}

export interface GithubRepo {
    id: string
    repo: string
    githubUrl: string
}

export interface MakerGithubEcosystem {
    id: string
    makerRepoId: string
    cuGithubRepoId: string
    date: string
    url: string
    org: number
    repo: number
    uniqueContributors: number
    commits4w: number
    totalStars: number
}

export interface CoreUnitFilter {
    id: number,
    code: string,
    name: string,
    shortCode: string
}

export class CoreUnitModel {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    };

    async getCoreUnits(filter: { limit?: number, offset?: number, filter?: CoreUnitFilter }): Promise<CoreUnit[]> {
        const baseQuery = this.knex
            .select('')
            .from('CoreUnit')
            .orderBy('id');
        if (filter.limit !== undefined && filter.offset !== undefined) {
            return baseQuery.limit(filter.limit).offset(filter.offset);
        } else if (filter.filter?.id !== undefined) {
            return baseQuery.where('id', filter.filter.id)
        } else if (filter.filter?.code !== undefined) {
            return baseQuery.where('code', filter.filter.code)
        } else if (filter.filter?.name !== undefined) {
            return baseQuery.where('name', filter.filter.name)
        } else if (filter.filter?.shortCode !== undefined) {
            return baseQuery.where('shortCode', filter.filter.shortCode)
        }
        else {
            return baseQuery;
        }
    };

    async getCoreUnit(paramName: string, paramValue: string): Promise<CoreUnit[]> {
        return this.knex('CoreUnit').where(`${paramName}`, paramValue)
    };

    async getCuUpdates(cuId: string | undefined): Promise<CuUpdate[]> {
        if (cuId === undefined) {
            return this.knex
                .select('*')
                .from('CuUpdate')
                .orderBy('id');
        } else {
            return this.knex('CuUpdate').where('cuId', cuId)
        }
    };

    async getCuUpdate(paramName: string, paramValue: string): Promise<CuUpdate[]> {
        return this.knex('CuUpdate').where(`${paramName}`, paramValue)
    };

    async getSocialMediaChannels(cuId: string | undefined): Promise<SocialMediaChannels[]> {
        if (cuId === undefined) {
            return this.knex
                .select('*')
                .from('SocialMediaChannels')
                .orderBy('id');
        } else {
            return this.knex('SocialMediaChannels').where('cuId', cuId)
        }
    };

    async getSocialMediaChannel(paramName: string, paramValue: string): Promise<SocialMediaChannels[]> {
        return this.knex('SocialMediaChannels').where(`${paramName}`, paramValue)
    };

    async getContributorCommitments(cuId: string | undefined): Promise<ContributorCommitment[]> {
        if (cuId === undefined) {
            return this.knex
                .select('*')
                .from('ContributorCommitment')
                .orderBy('id');
        } else {
            return this.knex('ContributorCommitment').where('cuId', cuId)
        }
    };

    async getContributorCommitment(paramName: string, paramValue: string): Promise<ContributorCommitment[]> {
        return this.knex('ContributorCommitment').where(`${paramName}`, paramValue)
    };

    async getCuGithubContributions(cuId: string | undefined): Promise<CuGithubContribution[]> {
        if (cuId === undefined) {
            return this.knex
                .select('*')
                .from('CuGithubContribution')
                .orderBy('id');
        } else {
            return this.knex('CuGithubContribution').where('cuId', cuId)
        }
    };

    async getCuGithubContribution(paramName: string, paramValue: string): Promise<CuGithubContribution[]> {
        return this.knex('CuGithubContribution').where(`${paramName}`, paramValue)
    };

    async getContributors(limit: number | undefined, offset: number | undefined): Promise<Contributor[]> {
        if (limit !== undefined && offset !== undefined) {
            return this.knex
                .select()
                .from('Contributor')
                .limit(limit)
                .offset(offset)
                .orderBy('id');
        } else {
            return this.knex
                .select('*')
                .from('Contributor')
                .orderBy('id');
        }
    };

    async getContributor(paramName: string, paramValue: string): Promise<Contributor[]> {
        return this.knex('Contributor').where(`${paramName}`, paramValue)
    };

    async getGithubOrgs(id: string | undefined): Promise<GithubOrg[]> {
        if (id === undefined) {
            return this.knex
                .select('*')
                .from('GithubOrg')
                .orderBy('id');
        } else {
            return this.knex('GithubOrg').where('id', id)
        }
    };

    async getGithubOrg(paramName: string, paramValue: string): Promise<GithubOrg[]> {
        return this.knex('GithubOrg').where(`${paramName}`, paramValue)
    };

    async getGithubRepos(id: string | undefined): Promise<GithubRepo[]> {
        if (id === undefined) {
            return this.knex
                .select('*')
                .from('GithubRepo')
                .orderBy('id')
        } else {
            return this.knex('GithubRepo').where('id', id)
        }
    };

    async getGithubRepo(paramName: string, paramValue: string): Promise<GithubRepo[]> {
        return this.knex('GithubRepo').where(`${paramName}`, paramValue)
    };

    async getMakerGithubEcosystemAll(): Promise<MakerGithubEcosystem[]> {
        return this.knex
            .select('*')
            .from('MakerGithubEcosystem')
            .orderBy('id');
    };

    async getMakerGithubEcosystem(paramName: string, paramValue: number | string): Promise<MakerGithubEcosystem[]> {
        return this.knex('MakerGithubEcosystem').where(`${paramName}`, paramValue)
    };
}

export default (knex: Knex) => new CoreUnitModel(knex);