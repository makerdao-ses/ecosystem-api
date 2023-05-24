import {
    response
} from "express";

const finalizeProtocolAccount = async (snapshotReport, protocolAccountId, knex) => {

    knex.update
}

const handleGroupAccounts = async (snapshotReport, parentId, knex) => {

    let groupId;
    let existingEntry = await knex('SnapshotAccount')
        .where({
            snapshotId: snapshotReport.id,
            accountLabel: 'group account',
            accountType: 'group',
            accountAddress: '0xGROUP',
            upstreamAccountId: parentId,
        })
        .select('id')
        .first();

    if (existingEntry) {
        groupId = existingEntry.id;
    } else {
        // Entry does not exist, perform insert
        let insert = await knex('SnapshotAccount')
            .insert({
                snapshotId: snapshotReport.id,
                accountLabel: 'group account',
                accountType: 'group',
                accountAddress: '0xGROUP',
                upstreamAccountId: parentId,
            })
            .returning('id');
        groupId = insert[0].id;

    }

    return groupId;
};



const finalizeReportAccounts = async (snapshotReport, ownerAccounts, protocolAccountId, knex) => {

    console.log(`Finalising report for id:${snapshotReport.id}`);
    let auditorId;

    // if Maker Protocol - No Parent / No Group
    for (let i = 0; i < ownerAccounts.length; i++) {
        //Handle audit wallets
        if (ownerAccounts[i].label.toLowerCase().includes('audit')) {
            auditorId = ownerAccounts[i].accountId;
            await knex('SnapshotAccount')
                .where('id', '=', ownerAccounts[i].accountId)
                .update({
                    upstreamAccountId: protocolAccountId
                });
        }
    }

    // handle other accounts
    for (let j = 0; j < ownerAccounts.length; j++) {

        if (auditorId && !ownerAccounts[j].label.toLowerCase().includes('audit')) {
            if (ownerAccounts[j].group === 'Y') {
                let groupAccountId = await handleGroupAccounts(snapshotReport, auditorId, knex);
                await knex('SnapshotAccount')
                    .where('id', '=', ownerAccounts[j].accountId)
                    .update({
                        upstreamAccountId: auditorId,
                        groupAccountId: groupAccountId
                    });
            } else {
                await knex('SnapshotAccount')
                    .where('id', '=', ownerAccounts[j].accountId)
                    .update({
                        upstreamAccountId: auditorId,
                    });
            }
        }
        if (!auditorId) {
            if (ownerAccounts[j].group === 'Y') {
                let groupAccountId = await handleGroupAccounts(snapshotReport, protocolAccountId, knex);
                await knex('SnapshotAccount')
                    .where('id', '=', ownerAccounts[j].accountId)
                    .update({
                        upstreamAccountId: protocolAccountId,
                        groupAccountId: groupAccountId
                    });
            } else {
                await knex('SnapshotAccount')
                    .where('id', '=', ownerAccounts[j].accountId)
                    .update({
                        upstreamAccountId: protocolAccountId,
                    });
            }

        }
    }


    // if label contains 'audit', parent = maker protocol
    // if group, check if group line exists, if not create. 
    // Assign group parent to auditor, if none then maker protocol
    // save parent Id, assign to all group accounts, 
    //save group line id, assing to group value of all group accounts, change accountType: group


};

export default finalizeReportAccounts;