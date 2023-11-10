/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("RolePermission").del();
  await knex("UserRole").del();
  await knex("Role").del();
  await knex("User").del();
  await knex("ViewDataCache").del();
  await knex("BudgetToolVersion").del();

  /*await knex('ViewDataCache').insert([
    {lastUpdate:'2022-06-22 19:10:25-07', value: {"employees":[
      {"firstName":"John", "lastName":"Doe"},
      {"firstName":"Anna", "lastName":"Smith"},
      {"firstName":"Peter", "lastName":"Jones"}
    ]}}
  ]);
  */

  await knex("User").insert([{ username: "user1", password: "password123" }]);

  await knex("Role").insert([
    { roleName: "CoreUnit" },
    { roleName: "SuperUser" },
  ]);

  await knex("RolePermission").insert([
    { roleId: 1, permission: "Create", resourceId: "1" },
  ]);

  await knex("UserRole").insert([
    { roleId: 1, userId: 1, resource: "System", resourceId: 1 },
  ]);

  await knex("BudgetToolVersion").insert([
    {
      version: "1.0.1",
      link: "https://github.com/pcatana/budget-tool/releases/tag/v1.1.0",
    },
  ]);
}
