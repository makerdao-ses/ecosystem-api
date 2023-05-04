import { Knex } from "knex";

export interface User {
    id: string
    username: string
    isActive: string
}

export interface count {
    count: number | string
}

export interface UserFilter {
    id?: number
    username?: string
    active?: boolean
    rolesAndPermissions?: boolean
    ids?: number[]
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

    async canUpdateCoreUnit(userId: number, resourceType: string, resourceId: number): Promise<any> {
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
                "UserRole.resourceId": resourceId
            })
            .orWhere({
                userId,
                "UserRole.resourceId": null
            })
    };

    async userCanManage(user: { id: number } | undefined, resourceType: string): Promise<Boolean> {
        if (!user) {
            return false;
        }
        const result = await this.knex
            .count('*')
            .from('UserRole')
            .leftJoin('RolePermission', function () {
                this
                    .on('UserRole.roleId', '=', 'RolePermission.roleId')
                    .andOn('UserRole.resource', '=', 'RolePermission.resource')
            })
            .where({
                userId: user.id,
                'RolePermission.permission': 'Manage',
                'RolePermission.resource': resourceType,
                resourceId: null
            }) as any;
        return parseFloat(result[0]['count']) > 0
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

    async can(userId: number, permission: string, resourceType: string): Promise<any> {
        return this.knex
            .select('resourceId')
            .from('UserRole')
            .leftJoin('RolePermission', function () {
                this
                    .on('UserRole.roleId', '=', 'RolePermission.roleId')
                    .andOn('UserRole.resource', '=', 'RolePermission.resource')
            })
            .where({
                userId: userId,
                'RolePermission.permission': permission,
                'RolePermission.resource': resourceType
            })
    }

    async canAudit(userId: number, resource: string): Promise<any> {
        return this.knex
            .select('resourceId')
            .from('UserRole')
            .leftJoin('RolePermission', function () {
                this
                    .on('UserRole.roleId', '=', 'RolePermission.roleId')
                    .andOn('UserRole.resource', '=', 'RolePermission.resource')
            })
            .where({
                userId: userId,
                'RolePermission.permission': 'Audit',
                'RolePermission.resource': "CoreUnit"
            })
            .orWhere({
                userId: userId,
                'RolePermission.permission': "Manage",
                'RolePermission.resource': "System"
            })

    }

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

    async getSystemRoleMembers(roleName: string, resource: string, resourceId: number | null) {
        const baseQuery = this.knex
            .select('UserRole.userId')
            .from('Role')
            .leftJoin('UserRole', function () {
                this
                    .on('Role.id', '=', 'UserRole.roleId')
            })
            .where('system', true)
            .where('roleName', roleName)
            .where('resource', resource);
        if (resourceId === null) {
            return baseQuery.where('resourceId', null);
        } else {
            baseQuery.where(function () {
                this.where('resourceId', null).orWhere('resourceId', resourceId)
            })
        }
        const userIds = await baseQuery as { userId: number }[];
        return this.getUsersFiltered({
            ids: userIds.map(u => u.userId),
            active: true,
            rolesAndPermissions: false
        })
    }

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

    async getUsersFiltered(filter: UserFilter): Promise<User[]> {
        if (filter.rolesAndPermissions) {
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
            if (filter.id) {
                baseQuery.where('User.id', filter.id);
            } else if (filter.username) {
                baseQuery.where('username', filter.username);
            } else if (filter.ids) {
                baseQuery.whereIn('User.id', filter.ids)
            }
            if (filter.active) {
                baseQuery.where('active', filter.active);
            }
            return baseQuery;
        } else {
            const baseQuery = this.knex
                .select('id', 'username', 'active')
                .from('User');
            if (filter.id) {
                baseQuery.where('id', filter.id);
            } else if (filter.username) {
                baseQuery.where('username', filter.username);
            } else if (filter.ids) {
                baseQuery.whereIn('User.id', filter.ids)
            }
            if (filter.active) {
                baseQuery.where('active', filter.active);
            }
            return baseQuery;
        }
    }

    async setActiveFlag(userId: number, active: boolean): Promise<any> {
        return this.knex('User').where('id', userId).update({ active });
    };

    async userDelete(userId: number | string): Promise<any> {
        await this.knex('UserRole').where('userId', userId).del();
        await this.knex('User').where('id', userId).del();
    }
};

export default (knex: Knex) => new AuthModel(knex);