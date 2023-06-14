const getAccountTypeGroup = (accountType) => {
    const mapping = {
        "DSSVest": "DSSVest",
        "Auditor": "Auditor",
        "Operational": "Operational",
        "Emergency": "Operational",
        "Accountant": "Operational",
    };
    const key = ("" + accountType).trim() || "Operational";

    if (!mapping[key]) {
        throw new Error(`Unsupported account type for group name: "${accountType}"`);
    }
    return mapping[key];
};

const getGroupUpstream = (groupName, allAccounts) => {
    const mapping = {
        "Operational": [
            "Protocol",
            "DSSVest",
            "Auditor",
        ],
        "Auditor": [
            "Protocol",
            "DSSVest",
        ],
        "DSSVest": [
            "Protocol"
        ],
        "Reserve": [
            "Protocol"
        ],
        "Protocol": [
            null
        ]
    };

    const upstreamCandidates = mapping[groupName];
    if (!upstreamCandidates) {
        throw new Error(`Unsupported group name for upstream: "${groupName}"`);
    }
    let index = 0;

    for (let i = 0; i < allAccounts.length; i++) {
        const newIndex = upstreamCandidates.indexOf(allAccounts[i].group);
        if (newIndex > index) {
            index = newIndex;
        }
    }

    return upstreamCandidates[index];
};

const updateUpstreamIds = async (allAccountsInfo, knex) => {
    console.log(`Updating upstream ids for ${allAccountsInfo.allAccounts.length} accounts`);

    for (let i = 0; i < allAccountsInfo.allAccounts.length; i++) {
        const upstreamGroupName = getGroupUpstream(allAccountsInfo.allAccounts[i].group, allAccountsInfo.allAccounts);
        if (upstreamGroupName !== null) {
            const upstreamGroupId = allAccountsInfo.groupUpstreamIds[upstreamGroupName];
            console.log(allAccountsInfo.allAccounts[i].id, "=>", upstreamGroupName, upstreamGroupId);

            await knex('SnapshotAccount')
                .where('id', '=', allAccountsInfo.allAccounts[i].id)
                .update({
                    upstreamAccountId: upstreamGroupId
                });
        }
    }
};



const createGroupAccount = async (snapshotReport, label, groupAccountId, knex) => {

    let groupId;
    let existingEntry = await knex('SnapshotAccount')
        .where({
            snapshotId: snapshotReport.id,
            accountLabel: label,
            accountType: 'group',
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
                accountLabel: label,
                accountType: 'group',
                accountAddress: '0xGROUP',
                groupAccountId: groupAccountId
            })
            .returning('id');
        groupId = insert[0].id;
    }
    return groupId;
};

const createGroupAccounts = async (snapshotReport, singularAccounts, protocolAccountId, knex) => {
    const accountsInfo = {
        allAccounts: [{
            id: protocolAccountId,
            group: 'Protocol'
        }],
        groupUpstreamIds: {
            "Protocol": protocolAccountId
        }
    };

    for (let i = 0; i < singularAccounts.length; i++) {
        accountsInfo.allAccounts.push({
            id: singularAccounts[i].accountId,
            group: getAccountTypeGroup(singularAccounts[i].type)
        });
    }

    const coreUnitReservesAccountId = await createGroupAccount(snapshotReport, 'Core Unit Reserves', null, knex);
    accountsInfo.allAccounts.push({
        id: coreUnitReservesAccountId,
        group: 'Reserve'
    });
    accountsInfo.groupUpstreamIds.Reserve = coreUnitReservesAccountId;

    const onchainAccountId = await createGroupAccount(snapshotReport, 'On-Chain Reserves', coreUnitReservesAccountId, knex);
    accountsInfo.allAccounts.push({
        id: onchainAccountId,
        group: 'Reserve'
    });
    //const offchainAccountId = await createGroupAccount(snapshotReport, 'Off-Chain Reserves', coreUnitReservesAccountId, knex);


    const groupAccountMapping = {};
    for (let i = 0; i < singularAccounts.length; i++) {
        const groupName = getAccountTypeGroup(singularAccounts[i].type);
        if (!groupAccountMapping[groupName]) {
            groupAccountMapping[groupName] = onchainAccountId;
            accountsInfo.groupUpstreamIds[groupName] = singularAccounts[i].accountId;
        } else if (groupAccountMapping[groupName] === onchainAccountId) {
            groupAccountMapping[groupName] = await createGroupAccount(snapshotReport, groupName, onchainAccountId, knex);
            accountsInfo.groupUpstreamIds[groupName] = groupAccountMapping[groupName];
            accountsInfo.allAccounts.push({
                id: groupAccountMapping[groupName],
                group: groupName
            });
            console.log(`Updating group account id for ${groupName} to ${groupAccountMapping[groupName]}`);
        }
    }

    for (let i = 0; i < singularAccounts.length; i++) {
        const groupName = getAccountTypeGroup(singularAccounts[i].type);
        await knex('SnapshotAccount')
            .where('id', '=', singularAccounts[i].accountId)
            .update({
                groupAccountId: groupAccountMapping[groupName]
            });
    }

    return accountsInfo;

};





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



const finalizeReportAccounts = async (snapshotReport, singularAccounts, protocolAccountId, knex) => {

    console.log(`Finalising report for id:${snapshotReport.id}`);

    const filteredSingularAccounts = singularAccounts.filter(a => (a.accountId || 0) > 0);

    const allAccountsInfo = await createGroupAccounts(snapshotReport, filteredSingularAccounts, protocolAccountId, knex);
    console.log(allAccountsInfo);

    await updateUpstreamIds(allAccountsInfo, knex);

    return;

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
};

export default finalizeReportAccounts;