enum ResourceType {
  System = "System",
  CoreUnit = "CoreUnit",
}

export class Authorization {
  userId: any;
  initialized = false;
  db: any;

  constructor(db: any, userId: any) {
    this.db = db;
    this.userId = userId;
  }

  /**
   * Get the user's roles on a particular resource
   */
  // async getRoles(resource: any, resourceId: any): Promise<Array<{roleName: string, resource: any, resourceId: any}>> {
  // query userRole this.userId
  // join of Roles and Permission of Roles
  // returns [{roleName, resource, resourceId}]
  // }

  /**
   * Check if the user has a given permission on a resource type or individual resource.
   */

  // Todo
  // canCreate()
  async canUpdate(
    resourceType: ResourceType,
    resourceId: any,
  ): Promise<number> {
    return await this.db.Auth.canUpdate(this.userId, resourceType, resourceId);
  }
  // canDelete()
  async canManage(userId: any, resourceType: ResourceType): Promise<number> {
    return await this.db.Auth.canManage(this.userId, resourceType);
  }

  // async can(permission: any, resourceType: ResourceType, resourceId: any = null): Promise<number> {

  // }
}
