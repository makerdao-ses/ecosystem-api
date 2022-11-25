import { Knex } from "knex";

export interface User {
    id: string
    username: string
    isActive: string
}

export interface count {
    count: number | string
}

export class AuthModel {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    };

    async getUser(paramName: string, paramValue: string | number | boolean): Promise<User[]> {
        return this.knex('User').where(`${paramName}`, paramValue)
    };

    async getResourceId(userId: number) {
        return this.knex
            .select('resourceId')
            .from('UserRole')
            .where('userId', userId)
    };

    async canUpdate(userId: number, resourceType: string, resourceId: number): Promise<any> {
        return this.knex
            .count('*')
            .from('UserRole')
            .leftJoin('RolePermission', function () {
                this
                    .on('UserRole.roleId', '=', 'RolePermission.roleId')
                    .andOn('UserRole.resource', '=', 'RolePermission.resource')
            })
            .where({
                userId: userId,
                'RolePermission.permission': 'Update',
                'RolePermission.resource': resourceType,
            })
            .orWhere({ "resourceId": resourceId || null })
    };

    async canManage(userId: number, resourceType: string): Promise<any> {
        return this.knex
            .count('*')
            .from('UserRole')
            .leftJoin('RolePermission', function () {
                this
                    .on('UserRole.roleId', '=', 'RolePermission.roleId')
                    .andOn('UserRole.resource', '=', 'RolePermission.resource')
            })
            .where({
                userId: userId,
                'RolePermission.permission': 'Manage',
                'RolePermission.resource': resourceType,
                resourceId: null
            });
    };

    async changeUserPassword(username: string, password: string): Promise<any> {
        return this.knex('User').where('username', username).update('password', password).returning('*')
    };

    async createUser(username: string, password: string): Promise<any> {
        const user = await this.knex('User').insert({ username, password, active: true }).returning("*");
        return {
            id: user[0].id,
            username: user[0].username,
            active: user[0].active
        }

    };

    async getUsers(paramName: string | undefined, paramValue: number | string | undefined): Promise<User[]> {
        const baseQuery = this.knex
            .select('User.id', 'username', 'active', 'roleName', 'UserRole.roleId', 'permission', 'UserRole.resource', 'UserRole.resourceId')
            .from('User')
            .leftJoin('UserRole', function () {
                this
                    .on('UserRole.userId', '=', 'User.id')
            })
            .leftJoin('Role', function () {
                this
                    .on('Role.id', '=', 'UserRole.roleId')
            })
            .leftJoin('RolePermission', function () {
                this
                    .on('RolePermission.roleId', '=', 'UserRole.roleId')
                    .andOn('UserRole.resource', '=', 'RolePermission.resource')
            })
            .orderBy('User.id', 'asc');
        if (paramName !== undefined && paramValue !== undefined) {
            return await baseQuery.where(paramName === 'id' ? 'User.id' : `${paramName}`, paramValue);
        }

        return await baseQuery;
    };

    async setActiveFlag(userId: number, active: boolean): Promise<any> {
        return this.knex('User').where('id', userId).update({ active });
    };

    async userDelete(userId: number | string): Promise<any> {
        await this.knex('UserRole').where('userId', userId).del();
        await this.knex('User').where('id', userId).del();
    }
};

export default (knex: Knex) => new AuthModel(knex);