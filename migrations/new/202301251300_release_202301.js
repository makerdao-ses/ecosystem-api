//Up migration correct entries in the ChangeTrackingEvents table
export async function up(knex) {

    await knex('ChangeTrackingEvents')
        .where('event', 'CU_BUDGET_STATEMENT_CREATE')
        .update({
      event: 'CU_BUDGET_STATEMENT_CREATED'
    });
}


//Down migration reverts the up migration change
export async function down(knex) {

    

}