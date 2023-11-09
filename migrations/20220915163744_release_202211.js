//Creation of the Roadmap subtables

export function up(knex) {
    return knex.schema

        .createTable('Stakeholder', function (table) {
            console.log("Creating Stakeholder table...");
            table.increments('id').primary();
            table.varchar('name').notNullable();
            table.integer('stakeholderContributorId');
            table.foreign('stakeholderContributorId').references('Contributor.id').onDelete('CASCADE');
            table.integer('stakeholderCuId');
            table.foreign('stakeholderCuId').references('CoreUnit.id').onDelete('CASCADE');
        })

        .createTable('StakeholderRole', function (table) {
            console.log("Creating StakeholderRole table...");
            table.increments('id').primary();
            table.varchar('stakeholderRoleName').notNullable();
        })

        .createTable('RoadmapStakeholder', function (table) {
            console.log("Creating RoadmapStakeholder table...");
            table.increments('id').primary();
            table.integer('stakeholderId').notNullable();
            table.foreign('stakeholderId').references('Stakeholder.id').onDelete('CASCADE');
            table.integer('roadmapId').notNullable();
            table.foreign('roadmapId').references('Roadmap.id').onDelete('CASCADE');
            table.integer('stakeholderRoleId').notNullable();
            table.foreign('stakeholderRoleId').references('StakeholderRole.id').onDelete('CASCADE');
        })

        .createTable('Output', function (table) {
            console.log("Creating Output table...");
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('outputUrl').notNullable();
            table.date('outputDate');
        })

        .createTable('OutputType', function (table) {
            console.log("Creating OutputType table...");
            table.increments('id').primary();
            table.string('outputType').notNullable();
        })

        .createTable('RoadmapOutput', function (table) {
            console.log("Creating RoadmapOutput table...");
            table.increments('id').primary();
            table.integer('outputId').notNullable();
            table.foreign('outputId').references('Output.id').onDelete('CASCADE');
            table.integer('outputTypeId').notNullable();
            table.foreign('outputTypeId').references('OutputType.id').onDelete('CASCADE');
        })

        .createTable('Task', function (table) {
            console.log("Creating Task table...");
            table.increments('id').primary();
            table.integer('parentId');
            table.foreign('parentId').references('Task.id').onDelete('CASCADE');
            table.string('taskName').notNullable();
            table.enu('taskStatus', ['ToDo', 'InProgress', 'Done', 'WontDo', 'Blocked', 'Backlog'], {
                useNative: true,
                enumName: 'TaskStatus'
            }).notNullable();
            table.integer('ownerStakeholderId');
            table.foreign('ownerStakeholderId').references('Stakeholder.id').onDelete('CASCADE');
            table.date('startDate');
            table.integer('position').notNullable();
            table.date('target');
            table.decimal('completedPercentage', 4, 2);
            table.enu('confidenceLevel', ['High', 'Medium', 'Low'], {
                useNative: true,
                enumName: 'ConfidenceLevel'
            }).notNullable();
            table.text('comments');
        })

        .createTable('Review', function (table) {
            console.log("Creating Review table...");
            table.increments('id').primary();
            table.integer('taskId').notNullable();
            table.foreign('taskId').references('Task.id').onDelete('CASCADE');
            table.date('reviewDate').notNullable();
            table.enu('reviewOutcome', ['Red', 'Yellow', 'Green'], {
                useNative: true,
                enumName: 'ReviewOutcome'
            }).notNullable();
            table.text('comments');
        })

        .createTable('Milestone', function (table) {
            console.log("Creating Milestone table...");
            table.increments('id').primary();
            table.integer('roadmapId').notNullable();
            table.foreign('roadmapId').references('Roadmap.id').onDelete('CASCADE');
            table.integer('taskId').notNullable();
            table.foreign('taskId').references('Task.id').onDelete('CASCADE');
        })


}


export function down(knex) {
    console.log("Dropping tables Roadmap subtables...");

    return knex.schema

        .dropTable("Milestone")
        .dropTable("Review")
        .dropTable("Task")
        .dropTable("RoadmapOutput")
        .dropTable("OutputType")
        .dropTable("Output")
        .dropTable("RoadmapStakeholder")
        .dropTable("StakeholderRole")
        .dropTable("Stakeholder")
        .raw('DROP TYPE "TaskStatus"')
        .raw('DROP TYPE "ConfidenceLevel"')
        .raw('DROP TYPE "ReviewOutcome"')

}