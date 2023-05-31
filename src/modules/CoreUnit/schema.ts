import _ from 'lodash'

import {
    typeDefs as CoreUnit,
    resolvers as CoreUnitResolvers
} from './schema/coreUnit.js';

import {
    typeDefs as SocialMediaChannels,
    resolvers as SocialMediaChannelsResolvers
} from './schema/socialMediaChannels.js';

import {
    typeDefs as ContributorCommitment,
    resolvers as ContributorCommitmentResolvers
} from './schema/contributorCommitment.js';

import {
    typeDefs as CuGithubContribution,
    resolvers as CuGithubContributionResolvers
} from './schema/cuGithubContribution.js';

import {
    typeDefs as Team,
    resolvers as TeamResolvers
} from './schema/teams.js';

const typeDefs = [
    CoreUnit,
    SocialMediaChannels,
    ContributorCommitment,
    CuGithubContribution,
    Team
];

const resolvers = _.merge(
    CoreUnitResolvers,
    SocialMediaChannelsResolvers,
    ContributorCommitmentResolvers,
    CuGithubContributionResolvers,
    TeamResolvers
);

export { typeDefs, resolvers };