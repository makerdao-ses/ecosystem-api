import { gql, AuthenticationError } from "apollo-server-core";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { QueryParams } from "../../utils/QueryParams.js";
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
                const filter = new QueryParams(input);
                const userFilter = { active: true, rolesAndPermissions: false };
                // User with System/Manage permission can list the inactive users including roles and permissions
                if (await dataSources.db.Auth.userCanManage(user, 'System')) {
                    userFilter.active = false;
                    userFilter.rolesAndPermissions = true;
                }
                // users without system/manage permission, can fetch only their own roles and permissions
                else if (user && parseInt(filter.get('id')) === parseInt(user.id)) {
                    userFilter.rolesAndPermissions = true;
                } else if (user && filter.get('username') === user.username) {
                    userFilter.rolesAndPermissions = true;
                }
                if (filter.has('id')) {
                    userFilter.id = filter.get('id')
                    if (filter.has('username')) {
                        throw new Error('Filter can only have user id or username')
                    }
                } else if (filter.has('username')) {
                    userFilter.username = filter.get('username')
                }
                const result = await dataSources.db.Auth.getUsersFiltered(userFilter);
                return parseToSchemaUser(result)

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
                        const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                        const match = await bcrypt.compare(input.password, userObj.password);
                        if (match) {
                            const hash = await bcrypt.hash(input.newPassword, 10);
                            await dataSources.db.Auth.changeUserPassword(input.username, hash);
                            const result = await dataSources.db.Auth.getUsers('username', input.username);
                            if (result.length < 1) {
                                const [user] = await dataSources.db.Auth.getUser('username', input.username)
                                return user;
                            }
                            return parseToSchemaUser(result)[0];
                        } else {
                            throw new Error('Wrong admin old password')
                        }
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
                if (filter == undefined) {
                    throw Error('Specify which user to delete in filter')
                }
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login!")
                } else {
                    const allowed = await dataSources.db.Auth.canManage(user.id, 'System')
                    if (allowed[0].count > 0) {
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
                        if (parseFloat(filter.id) !== parseFloat(user.id)) {
                            throw Error('Make sure user ID is correct')
                        }
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
export const parseToSchemaUser = (rawData) => {
    let previousUserId = null;
    let groupedUserRows = [];
    const result = [];
    rawData.forEach(row => {
        if (previousUserId === row.id) {
            groupedUserRows.push(row);
        } else {
            if (groupedUserRows.length > 0) {
                result.push(buildUserObjectFromGroupedRows(groupedUserRows));
            }
            groupedUserRows = [];
            groupedUserRows.push(row);
            previousUserId = groupedUserRows[0].id
        }
    })
    if (groupedUserRows.length > 0) {
        result.push(buildUserObjectFromGroupedRows(groupedUserRows));
    }
    return result
}

const buildUserObjectFromGroupedRows = (rows) => {
    const result = {
        id: rows[0].id,
        username: rows[0].username,
        active: rows[0].active,
        roles: []
    }

    if (rows[0].roleId !== undefined && rows[0].roleId !== null) {
        let previousRoleId = null;
        let groupedRoleRows = [];
        rows.forEach(row => {
            if (previousRoleId === row.roleId) {
                groupedRoleRows.push(row)
            } else {
                if (groupedRoleRows.length > 0) {
                    result.roles.push(buildRoleObjectFromGroupedRows(groupedRoleRows))
                }
                groupedRoleRows = [];
                groupedRoleRows.push(row);
                previousRoleId = groupedRoleRows[0].roleId;
            }
        })
        if (groupedRoleRows.length > 0) {
            result.roles.push(buildRoleObjectFromGroupedRows(groupedRoleRows))
        }
    }
    return result;
}

const buildRoleObjectFromGroupedRows = (rows) => {
    const result = {
        id: rows[0].roleId,
        name: rows[0].roleName,
        permissions: rows.filter(row => row.resource !== null).map(row => {
            if (row.permission === null) {
                if (row.resourceId === null) {
                    return row.resource
                } else {
                    return `${row.resource}//${row.resourceId}`
                }

            } else {
                if (row.resourceId === null) {
                    return `${row.resource}/${row.permission}`
                } else {
                    return `${row.resource}/${row.permission}/${row.resourceId}`
                }
            }
        })
    }
    return result;
}


// construct from the permission
export const getCuIdFromPermissions = (userObj) => {
    const rolesWithId = [];
    const roles = userObj[0].roles.map(role => {
        rolesWithId.push({ name: role.name, cuId: null })
        return role.permissions;
    }).flat();
    let cuId = undefined;
    roles.forEach((role, index) => {
        const regex = /[0-9]{1,}/;
        const rgxOutput = role.match(regex);
        if (rgxOutput !== null) {
            rolesWithId[index].cuId = rgxOutput[0]
        }
    })
    rolesWithId.map(role => {
        if (role.name === 'CoreUnitFacilitator') {
            cuId = role.cuId
        }
    })
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