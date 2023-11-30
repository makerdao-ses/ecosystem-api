// Set index in Snapshot tables ...

export async function up(knex) {

    console.log('Adding index in Snapshot table...');
    await knex.schema.alterTable("Snapshot", function (table) {
        table.index(["id"])
        table.index(["start"])
        table.index(["end"])
        table.index(["ownerType"])
        table.index(["ownerId"])
        table.index(["month"])
        table.index(["created"])
    });

    console.log('Adding index in SnapshotAccount table ...');
    await knex.schema.alterTable("SnapshotAccount", function (table) {
        table.index(["id"])
        table.index(["snapshotId"])
        table.index(["accountLabel"])
        table.index(["accountType"])
        table.index(["accountAddress"])
        table.index(["groupAccountId"])
        table.index(["upstreamAccountId"])
        table.index(["budgetId"])
        table.index(["offChain"])
    });

    console.log('Adding index in SnapshotAccountBalance table ...');
    await knex.schema.alterTable("SnapshotAccountBalance", function (table) {
        table.index(["id"])
        table.index(["snapshotAccountId"])
        table.index(["token"])
        table.index(["initialBalance"])
        table.index(["newBalance"])
        table.index(["inflow"])
        table.index(["outflow"])
        table.index(["includesOffChain"])
    });

    console.log('Adding index in SnapshotAccountTransaction table ...');
    await knex.schema.alterTable("SnapshotAccountTransaction", function (table) {
        table.index(["id"])
        table.index(["snapshotAccountId"])
        table.index(["block"])
        table.index(["timestamp"])
        table.index(["txHash"])
        table.index(["token"])
        table.index(["counterParty"])
        table.index(["amount"])
        table.index(["txLabel"])
        table.index(["counterPartyName"])

    });
}

export async function down(knex) {

    console.log('Dropping index in Snapshot table...');
    await knex.schema.alterTable("Snapshot", function (table) {
        table.dropIndex(["id"])
        table.dropIndex(["start"])
        table.dropIndex(["end"])
        table.dropIndex(["ownerType"])
        table.dropIndex(["ownerId"])
        table.dropIndex(["month"])
        table.dropIndex(["created"])
    });

    console.log('Dropping index in SnapshotAccount table ...');
    await knex.schema.alterTable("SnapshotAccount", function (table) {
        table.dropIndex(["id"])
        table.dropIndex(["snapshotId"])
        table.dropIndex(["accountLabel"])
        table.dropIndex(["accountType"])
        table.dropIndex(["accountAddress"])
        table.dropIndex(["groupAccountId"])
        table.dropIndex(["upstreamAccountId"])
        table.dropIndex(["budgetId"])
        table.dropIndex(["offChain"])
    });

    console.log('Dropping index in SnapshotAccountBalance table ...');
    await knex.schema.alterTable("SnapshotAccountBalance", function (table) {
        table.dropIndex(["id"])
        table.dropIndex(["snapshotAccountId"])
        table.dropIndex(["token"])
        table.dropIndex(["initialBalance"])
        table.dropIndex(["newBalance"])
        table.dropIndex(["inflow"])
        table.dropIndex(["outflow"])
        table.dropIndex(["includesOffChain"])
    });

    console.log('Dropping index in SnapshotAccountTransaction table ...');
    await knex.schema.alterTable("SnapshotAccountTransaction", function (table) {
        table.dropIndex(["id"])
        table.dropIndex(["snapshotAccountId"])
        table.dropIndex(["block"])
        table.dropIndex(["timestamp"])
        table.dropIndex(["txHash"])
        table.dropIndex(["token"])
        table.dropIndex(["counterParty"])
        table.dropIndex(["amount"])
        table.dropIndex(["txLabel"])
        table.dropIndex(["counterPartyName"])
    });
}