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
        username: String!
        password: String!
    }

    input AuthInput {
        username: String!
        password: String!
    }

    input UpdatePassword {
        username: String!
        password: String
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

    input UserDelete {
        id: ID
    }
    
    type Query {
        users(input: UsersFilter): [User]
    }

    type Mutation {
        userCreate(input: UserInput): User
        userLogin(input: AuthInput!): UserPayload!
        userChangePassword(input: UpdatePassword!): User
        userSetActiveFlag(input: UserSetActiveFlag): User
        userDelete(filter: UserDelete): User
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
                const [user] = await dataSources.db.Auth.getUser('username', input.username)
                if (user != undefined) {
                    const match = await bcrypt.compare(input.password, user.password);
                    if (match === true) {
                        if (user.active === false) {
                            throw new Error('Account disabled. Reach admin for more info.')
                        }
                        const result = await dataSources.db.Auth.getUsers('id', user.id);
                        let userObj;
                        let cuId;
                        // If user has assinged roles, parse to userObj
                        if (result.length > 0) {
                            userObj = parseToSchemaUser(result)
                            cuId = getCuIdFromPermissions(userObj);

                        } else {
                            userObj = await dataSources.db.Auth.getUser('username', input.username)
                        }
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
                    const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await dataSources.db.Auth.canManage(user.id, 'System')
                    if (allowed[0].count > 0) {
                        const [user] = await dataSources.db.Auth.getUser('username', input.username);
                        if (user === undefined && regexPw(input.password)) {
                            const hash = await bcrypt.hash(input.password, 10);
                            const userCreate = await dataSources.db.Auth.createUser(input.username, hash)
                            return userCreate;
                        } else {
                            throw new Error('username already taken, try a new one')
                        }
                    } else {
                        throw new AuthenticationError('You are not authorized')
                    }
                }
            } catch (error) {
                throw new Error(error ? error : 'You are not authorized')
            }
        },
        userChangePassword: async (_, { input }, { user, dataSources }) => {
            try {
                if (user) {
                    const [userObj] = await dataSources.db.Auth.getUser('username', input.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const match = await bcrypt.compare(input.newPassword, userObj.password);
                    if (match) {
                        throw new Error('new password should not be as old password')
                    }
                    const allowed = await dataSources.db.Auth.canManage(user.id, 'System');
                    if (allowed[0].count > 0 && regexPw(input.newPassword)) {
                        const hash = await bcrypt.hash(input.newPassword, 10);
                        await dataSources.db.Auth.changeUserPassword(input.username, hash);
                        const result = await dataSources.db.Auth.getUsers('username', input.username);
                        if (result.length < 1) {
                            const [user] = await dataSources.db.Auth.getUser('username', input.username)
                            return user;
                        }
                        return parseToSchemaUser(result)[0];
                    } else {
                        if (input.password !== '') {
                            const match = await bcrypt.compare(input.password, userObj.password);
                            if (match) {
                                if (regexPw(input.newPassword)) {
                                    const hash = await bcrypt.hash(input.newPassword, 10);
                                    await dataSources.db.Auth.changeUserPassword(input.username, hash);
                                    const result = await dataSources.db.Auth.getUsers('username', input.username);
                                    if (result.length < 1) {
                                        const [user] = await dataSources.db.Auth.getUser('username', input.username)
                                        return user;
                                    }
                                    return parseToSchemaUser(result)[0];
                                }
                            } else {
                                throw new Error('wrong old password')
                            }
                        }
                    }
                } else {
                    throw new Error('Gotta be logged in first no?')
                }
            } catch (error) {
                throw new Error(error ? error : 'password is incorrect')
            }
        },
        userSetActiveFlag: async (_, { input }, { user, auth, dataSources }) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login!")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await dataSources.db.Auth.canManage(user.id, 'System')
                    if (allowed[0].count > 0) {
                        await dataSources.db.Auth.setActiveFlag(input.id, input.active)
                        const result = await dataSources.db.Auth.getUsers('id', input.id);
                        return parseToSchemaUser(result)[0]
                    }
                    else {
                        throw new AuthenticationError('You are not authorized to perform this query')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'password is incorrect')
            }
        },
        userDelete: async (_, { filter }, { user, auth, dataSources }) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login!")
                } else {
                    const allowed = await dataSources.db.Auth.canManage(user.id, 'System')
                    if (allowed[0].count > 0) {
                        if (filter == undefined) {
                            throw Error('Specify which user to delete in filter')
                        }
                        console.log(`deleting user ${filter.id} as system manager`)
                        const result = await dataSources.db.Auth.getUsers('id', filter.id);
                        if (result.length < 1) {
                            const [user] = await dataSources.db.Auth.getUser('id', filter.id)
                            await dataSources.db.Auth.userDelete(filter.id)
                            return user;
                        }
                        await dataSources.db.Auth.userDelete(filter.id)
                        return parseToSchemaUser(result)[0]
                    } else {
                        console.log(`deleting user ${user.id} as user`)
                        const result = await dataSources.db.Auth.getUsers('id', user.id);
                        if (result.length < 1) {
                            const [userFrobDB] = await dataSources.db.Auth.getUser('id', user.id)
                            await dataSources.db.Auth.userDelete(user.id)
                            return userFrobDB;
                        }
                        await dataSources.db.Auth.userDelete(user.id)
                        return parseToSchemaUser(result)[0]
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error)
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

const regexPw = (pw) => {
    if (pw.length < 10) {
        throw Error('Your password must have at least 10 characters.');
    }
    let matchClasses = 0;

    const matchesLowerCaseChars = (pw) => {
        let count = 0;
        const regex = new RegExp(/[a-z]/);
        pw.split('').forEach(l => {
            if (regex.test(l)) {
                count++
            }
        })
        if (count >= 1) {
            return true;
        } else {
            throw Error('Your password must contain at least one lowercase character, number, or special character.')
        }
    }

    const matchesUpperCaseChars = (pw) => {
        let count = 0;
        const regex = new RegExp(/[A-Z]/);
        pw.split('').forEach(l => {
            if (regex.test(l)) {
                count++
            }
        })
        if (count >= 1) {
            return true;
        } else {
            throw Error('Your password must contain at least one uppercase character, number, or special character.')
        }
    }

    const matchesNumbers = (pw) => {
        let count = 0;
        const regex = new RegExp(/[0-9]/);
        pw.split('').forEach(l => {
            if (regex.test(l)) {
                count++
            }
        })
        if (count > 0) {
            return true;
        } else if (count === pw.length) {
            throw Error('Your password must contain at least one lowercase character, uppercase character, or special character.');
        }
        else {
            throw Error('Your password must contain at least one uppercase character, lowercase character, number, or special character.')
        }
    }

    matchesNumbers(pw)

    const matchesSpecialChars = (pw) => {
        let count = 0;
        const regex = new RegExp(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/);
        pw.split('').forEach(l => {
            if (regex.test(l)) {
                count++;
            }
        })
        if (count >= 1) {
            return true;
        } else if (count === pw.length) {
            throw Error('Your password must contain at least one lowercase character, uppercase character, or number.')
        }
        else {
            throw Error('Your password must contain at least one special character.')
        }
    }

    matchesSpecialChars(pw)

    if (matchesLowerCaseChars(pw)) {
        matchClasses++;
    }

    if (matchesUpperCaseChars(pw)) {
        matchClasses++;
    }

    if (matchClasses < 2 && matchesNumbers(pw)) {
        matchClasses++;
    }

    if (matchClasses < 2 && matchesSpecialChars(pw)) {
        matchClasses++;
    }

    if (matchClasses < 2) {
        throw Error("Password needs to match at least 2 of: lowercase chars, uppercase chars, numbers, special chars.")
    } else {
        return true
    }

}