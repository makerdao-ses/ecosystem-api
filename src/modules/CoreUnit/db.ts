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
    type: String
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
    id?: number,
    code?: string,
    name?: string,
    shortCode?: string
    type?: string
}

export interface SocialMediaChannelsFilter {
    id?: number | string
    cuId?: string | number
    forumTag?: string
    twitter?: string
    youtube?: string
    discord?: string
    linkedIn?: string
    website?: string
    github?: string
}

export interface ContributorCommitmentsFilter {
    id?: number
    cuId?: number
    contributorId?: number
    startDate?: string
    commitment?: string
    cuCode?: string
    jobTitle?: string
}

export interface ContributorFilter {
    id?: number
    name?: string
    forumHandle?: string
    discordHandle?: string
    twitterHandle?: string
    email?: string
}

export interface CuGithubContributionFilter {
    id?: number
    cuId?: number
    orgId?: number
    repoId?: number
}

export interface GithubOrgFilter {
    id?: number | string
    org?: string
    githubUrl?: string
}

export interface GithubRepoFilter {
    id?: number | string
    repo?: string
    githubUrl?: string
}

export interface MakerGithubEcosystemFilter {
    id?: number | string
    makerRepoId?: number | string
    cuGithubRepoId?: number | string
    date?: string
    url?: string
    org?: number
    repo?: number
    uniqueContributors?: number
    commits4w?: number
    totalStars?: number
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
            return baseQuery.limit(filter.limit).offset(filter.offset).where('type', 'CoreUnit');
        } else if (filter.filter?.id !== undefined) {
            return baseQuery.where('id', filter.filter.id).andWhere('type', 'CoreUnit');
        } else if (filter.filter?.code !== undefined) {
            return baseQuery.where('code', filter.filter.code).andWhere('type', 'CoreUnit');
        } else if (filter.filter?.name !== undefined) {
            return baseQuery.where('name', filter.filter.name).andWhere('type', 'CoreUnit');
        } else if (filter.filter?.shortCode !== undefined) {
            return baseQuery.where('shortCode', filter.filter.shortCode).andWhere('type', 'CoreUnit');
        } else if (filter.filter?.type !== undefined) {
            return baseQuery.where('type', filter.filter.type)
        } else {
            return baseQuery.where('type', 'CoreUnit');
        }
    };

    async getCuUpdates(filter?: { id?: number, cuId?: number, updateTitle?: string, updateDate?: string, updateUrl?: string }): Promise<CuUpdate[]> {
        const baseQuery = this.knex
            .select('*')
            .from('CuUpdate')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.cuId !== undefined) {
            return baseQuery.where('cuId', filter.cuId)
        } else if (filter?.updateTitle !== undefined) {
            return baseQuery.where('updateTitle', filter.updateTitle)
        } else if (filter?.updateDate !== undefined) {
            return baseQuery.where('updateDate', filter.updateDate)
        } else if (filter?.updateUrl !== undefined) {
            return baseQuery.where('updateUrl', filter.updateUrl)
        } else {
            return baseQuery;
        }
    };

    async getSocialMediaChannels(filter?: SocialMediaChannelsFilter): Promise<SocialMediaChannels[]> {
        const baseQuery = this.knex
            .select('*')
            .from('SocialMediaChannels')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.cuId !== undefined) {
            return baseQuery.where('cuId', filter.cuId)
        } else if (filter?.forumTag !== undefined) {
            return baseQuery.where('forumTag', filter.forumTag)
        } else if (filter?.twitter !== undefined) {
            return baseQuery.where('twitter', filter.twitter)
        } else if (filter?.youtube !== undefined) {
            return baseQuery.where('youtube', filter.youtube)
        } else if (filter?.discord !== undefined) {
            return baseQuery.where('discord', filter.discord)
        } else if (filter?.linkedIn !== undefined) {
            return baseQuery.where('linkedIn', filter.linkedIn)
        } else if (filter?.website !== undefined) {
            return baseQuery.where('website', filter.website)
        } else if (filter?.github !== undefined) {
            return baseQuery.where('github', filter.github)
        } else {
            return baseQuery;
        }
    };

    async getContributorCommitments(filter?: ContributorCommitmentsFilter): Promise<ContributorCommitment[]> {
        const baseQuery = this.knex
            .select('*')
            .from('ContributorCommitment')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.cuId !== undefined) {
            return baseQuery.where('cuId', filter.cuId)
        } else if (filter?.contributorId !== undefined) {
            return baseQuery.where('contributorId', filter.contributorId)
        } else if (filter?.startDate !== undefined) {
            return baseQuery.where('startDate', filter.startDate)
        } else if (filter?.commitment !== undefined) {
            return baseQuery.where('commitment', filter.commitment)
        } else if (filter?.cuCode !== undefined) {
            return baseQuery.where('cuCode', filter.cuCode)
        } else if (filter?.jobTitle !== undefined) {
            return baseQuery.where('jobTitle', filter.jobTitle)
        } else {
            return baseQuery
        }
    };

    async getCuGithubContributions(filter?: CuGithubContributionFilter): Promise<CuGithubContribution[]> {
        const baseQuery = this.knex
            .select('*')
            .from('CuGithubContribution')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.cuId !== undefined) {
            return baseQuery.where('cuId', filter.cuId)
        } else if (filter?.orgId !== undefined) {
            return baseQuery.where('orgId', filter.orgId)
        } else if (filter?.repoId !== undefined) {
            return baseQuery.where('repoId', filter.repoId)
        } else {
            return baseQuery;
        }
    };

    async getContributors(filter: { limit?: number, offset?: number, filter?: ContributorFilter }): Promise<Contributor[]> {
        const baseQuery = this.knex
            .select('*')
            .from('Contributor')
            .orderBy('id');
        if (filter.limit !== undefined && filter.offset !== undefined) {
            return baseQuery.limit(filter.limit).offset(filter.offset);
        } else if (filter.filter?.id !== undefined) {
            return baseQuery.where('id', filter.filter.id)
        } else if (filter.filter?.name !== undefined) {
            return baseQuery.where('name', filter.filter.name)
        } else if (filter.filter?.forumHandle !== undefined) {
            return baseQuery.where('forumHandle', filter.filter.forumHandle)
        } else if (filter.filter?.discordHandle !== undefined) {
            return baseQuery.where('discordHandle', filter.filter.discordHandle)
        } else if (filter.filter?.twitterHandle !== undefined) {
            return baseQuery.where('twitterHandle', filter.filter.twitterHandle)
        } else if (filter.filter?.email !== undefined) {
            return baseQuery.where('email', filter.filter.email)
        } else {
            return baseQuery;
        }
    };

    async getGithubOrgs(filter: GithubOrgFilter): Promise<GithubOrg[]> {
        const baseQuery = this.knex
            .select('*')
            .from('GithubOrg')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.org !== undefined) {
            return baseQuery.where('org', filter.org)
        } else if (filter?.githubUrl !== undefined) {
            return baseQuery.where('githubUrl', filter.githubUrl)
        } else {
            return baseQuery;
        }
    };

    async getGithubRepos(filter: GithubRepoFilter): Promise<GithubRepo[]> {
        const baseQuery = this.knex
            .select('*')
            .from('GithubRepo')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.repo !== undefined) {
            return baseQuery.where('repo', filter.repo)
        } else if (filter?.githubUrl !== undefined) {
            return baseQuery.where('githubUrl', filter.githubUrl)
        } else {
            return baseQuery;
        }
    };

    async getMakerGithubEcosystemAll(filter?: MakerGithubEcosystemFilter): Promise<MakerGithubEcosystem[]> {
        const baseQuery = this.knex
            .select('*')
            .from('MakerGithubEcosystem')
            .orderBy('id');
        if (filter?.id !== undefined) {
            return baseQuery.where('id', filter.id)
        } else if (filter?.date !== undefined) {
            return baseQuery.where('date', filter.date)
        } else if (filter?.url !== undefined) {
            return baseQuery.where('url', filter.url)
        } else if (filter?.org !== undefined) {
            return baseQuery.where('org', filter.org)
        } else if (filter?.repo !== undefined) {
            return baseQuery.where('repo', filter.repo)
        } else if (filter?.uniqueContributors !== undefined) {
            return baseQuery.where('uniqueContributors', filter.uniqueContributors)
        } else if (filter?.commits4w !== undefined) {
            return baseQuery.where('commits4w', filter.commits4w)
        } else if (filter?.totalStars !== undefined) {
            return baseQuery.where('totalStars', filter.totalStars)
        } else {
            return baseQuery;
        }
    };

}

export default (knex: Knex) => new CoreUnitModel(knex);