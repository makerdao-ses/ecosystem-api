import { gql, AuthenticationError } from "apollo-server-core";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config()

export const typeDefs = [gql`

    type User {
        id: ID
        username: String
        active: Boolean
        roles: [Role]
    }

    type Role {
        id: ID
        name: String
        permissions: [String]
    }

    type UserPayload {
        user: User
        authToken: String!
    }

    input UserInput {
        cuId: ID!
        username: String!
        password: String!
    }

    input AuthInput {
        username: String!
        password: String!
    }

    input UpdatePassword {
        username: String!
        password: String!
        newPassword: String!
    }

    input UsersFilter {
        id: ID
        username: String
        # isActive: String
    }

    input UserSetActiveFlag {
        id: ID!
        active: Boolean!
    }
    
    type Query {
        users(input: UsersFilter): [User]
    }

    type Mutation {
        userCreate(input: UserInput): User!
        userLogin(input: AuthInput!): UserPayload!
        userChangePassword(input: UpdatePassword!): User!
        userSetActiveFlag(input: UserSetActiveFlag): [User]
    }
`];

export const resolvers = {
    Query: {
        users: async (_, { input }, { user, auth, dataSources }) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login!")
                } else {
                    let paramName;
                    let paramValue;
                    if (input) {
                        const queryParams = Object.keys(input)
                        if (queryParams.length > 1) {
                            throw "Choose no more than 1 parameters"
                        }
                        paramName = queryParams[0];
                        paramValue = input[queryParams[0]];
                    }
                    const allowed = await dataSources.db.Auth.canManage(user.id, 'System')
                    if (allowed[0].count > 0) {
                        const result = await dataSources.db.Auth.getUsers(paramName, paramValue);
                        return parseToSchemaUser(result)
                    } else {
                        throw new AuthenticationError('You are not authorized to perform this query')
                    }

                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to perform this query')
            }
        }
    },
    Mutation: {
        userLogin: async (_, { input }, { dataSources }) => {
            try {
                const [user] = await dataSources.db.Auth.getUser(input.username)
                if (user != undefined) {
                    const match = await bcrypt.compare(input.password, user.password);
                    if (match === true) {
                        if (user.active === false) {
                            throw new Error('Account disabled. Reach admin for more info.')
                        }
                        const result = await dataSources.db.Auth.getUsers('id', user.id);
                        const userObj = parseToSchemaUser(result)
                        const cuId = getCuIdFromPermissions(userObj);
                        const token = jwt.sign(
                            { id: user.id, cuId, username: user.username },
                            process.env.SECRET,
                            { algorithm: "HS256", subject: `${user.id}`, expiresIn: "7d" }
                        );
                        return {
                            user: userObj[0],
                            authToken: token
                        }
                    } else {
                        throw new Error('wrong password? ')
                    }
                } else {
                    throw new Error('no such user')
                }
            } catch (error) {
                console.log(error);
                throw new AuthenticationError(error ? error : 'User not signed up')
            }
        },
        userCreate: async (_, { input }, { user, auth, dataSources }) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login!")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser(user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await dataSources.db.Auth.canManage(user.id, 'System')
                    if (allowed[0].count > 0) {
                        const [user] = await dataSources.db.Auth.getUser(input.username);
                        if (user === undefined) {
                            const hash = await bcrypt.hash(input.password, 10);
                            const result = await dataSources.db.Auth.createUser(input.cuId, input.username, hash)
                            return result;
                        } else {
                            throw new Error('username already taken, try a new one')
                        }
                    } else {
                        throw new AuthenticationError('You are not authorized')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized')
            }
        },
        userChangePassword: async (_, { input }, { user, dataSources }) => {
            try {
                if (user) {
                    const [userObj] = await dataSources.db.Auth.getUser(input.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const match = await bcrypt.compare(input.password, userObj.password);
                    if (match) {
                        const hash = await bcrypt.hash(input.newPassword, 10);
                        const result = await dataSources.db.Auth.changeUserPassword(input.username, hash);
                        return result[0];
                    } else {
                        throw new Error('wrong password')
                    }
                } else {
                    throw new Error('Gotta be logged in first no?')
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'password is incorrect')
            }
        },
        userSetActiveFlag: async (_, { input }, { user, auth, dataSources }) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login!")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser(user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await dataSources.db.Auth.canManage(user.id, 'System')
                    if (allowed[0].count > 0) {
                        await dataSources.db.Auth.setActiveFlag(input.id, input.active)
                        const result = await dataSources.db.Auth.getUsers('id', input.id);
                        return parseToSchemaUser(result)
                    }
                    else {
                        throw new AuthenticationError('You are not authorized to perform this query')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'password is incorrect')
            }
        }
    }

};

const parseToSchemaUser = (result) => {
    const usernames = result.map(user => user.username);
    let userObj = { id: '', username: '', active: '', roles: [] }
    const resultUsers = [];
    usernames.forEach((username, index) => {
        // If creating extra roles, we need to redo below 2 lines to automatically create role objects
        let role = { id: '', name: '', permissions: [] };
        let role2 = { id: '', name: '', permissions: [] };
        if (userObj.username !== username) {
            userObj.id = result[index].id
            userObj.username = username;
            userObj.active = result[index].active
            userObj.roles = []
            role.id = result[index].roleId
            role.name = result[index].roleName
            role.permissions = []
            usernames.forEach((userName, i) => {
                if (result[i].username === username && result[i].roleName === role.name) {
                    let str = `${result[i].resource}/${result[i].permission}`
                    if (result[i].resourceId !== null) {
                        str = str.concat(`/${result[i].resourceId}`)
                    }
                    role.permissions.push(str);
                } else if (result[i].username === username) {
                    role2.id = result[i].roleId
                    role2.name = result[i].roleName
                    let str = `${result[i].resource}/${result[i].permission}`
                    if (result[i].resourceId !== null) {
                        str = str.concat(`/${result[i].resourceId}`)
                    }
                    role2.permissions.push(str);
                }
            })
            userObj.roles.push(role)
            if (role2.id !== '') {
                userObj.roles.push(role2)
            }

            resultUsers.push({
                id: userObj.id,
                username: userObj.username,
                active: userObj.active,
                roles: userObj.roles
            })
        }
    });
    return resultUsers
}

const getCuIdFromPermissions = (userObj) => {
    const roles = userObj[0].roles.map(role => {
        return role.permissions;
    }).flat();
    let cuId = undefined;
    roles.forEach(role => {
        const id = role.substring(role.length - 2);
        const regex = /[0-9]{2}/;
        if (regex.test(id)) {
            cuId = id;
        }
    });
    return cuId;
};