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

const createGroupAccounts = async (snapshotReport, singularAccounts, protocolAccountId, makerProtocolAddresses, knex) => {
    const accountsInfo = {
        allAccounts: [{
            id: protocolAccountId,
            group: 'Protocol',
            internalAddresses: makerProtocolAddresses,
            internalIds: [protocolAccountId]
        }],
        groupUpstreamIds: {
            "Protocol": protocolAccountId
        }
    };
    let singularAccountsAddresses = [];
    let singularAccountsIds = [];

    for (let i = 0; i < singularAccounts.length; i++) {
        const newAccount = {
            id: singularAccounts[i].accountId,
            group: getAccountTypeGroup(singularAccounts[i].type),
            internalAddresses: [
                singularAccounts[i].address.toLowerCase()
            ],
            internalIds: [singularAccounts[i].accountId]
        };
        accountsInfo.allAccounts.push(newAccount);
        singularAccountsAddresses.push(newAccount.internalAddresses[0]);
        singularAccountsIds.push(newAccount.internalIds[0]);
    }

    const coreUnitReservesAccountId = await createGroupAccount(snapshotReport, 'Core Unit Reserves', null, knex);
    const coreUnitReservesAccount =  {
        id: coreUnitReservesAccountId,
        group: 'Reserve',
        internalAddresses: singularAccountsAddresses,
        internalIds: [coreUnitReservesAccountId].concat(singularAccountsIds)
    };
    accountsInfo.allAccounts.push(coreUnitReservesAccount);
    accountsInfo.groupUpstreamIds.Reserve = coreUnitReservesAccountId;

    const onchainAccountId = await createGroupAccount(snapshotReport, 'On-Chain Reserves', coreUnitReservesAccountId, knex);
    accountsInfo.allAccounts.push({
        id: onchainAccountId,
        group: 'Reserve',
        internalAddresses: singularAccountsAddresses,
        internalIds: [onchainAccountId].concat(singularAccountsIds)
    });
    coreUnitReservesAccount.internalIds.push(onchainAccountId);
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
                group: groupName,
                internalAddresses: singularAccounts.filter(sa=>getAccountTypeGroup(sa.type) == groupName).map(sa=>sa.address),
                internalIds: singularAccounts.filter(sa=>getAccountTypeGroup(sa.type) == groupName).map(sa=>sa.accountId).concat([groupAccountMapping[groupName]])
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

const finalizeReportAccounts = async (snapshotReport, singularAccounts, protocolAccountId, makerProtocolAddresses, knex) => {

    console.log(`Finalising report for id:${snapshotReport.id}`);

    const filteredSingularAccounts = singularAccounts.filter(a => (a.accountId || 0) > 0);

    const allAccountsInfo = await createGroupAccounts(snapshotReport, filteredSingularAccounts, protocolAccountId, makerProtocolAddresses, knex);

    console.log('All Accounts Info: ', allAccountsInfo.allAccounts);
    console.log('Upstream Account Ids:', allAccountsInfo.groupUpstreamIds);

    await updateUpstreamIds(allAccountsInfo, knex);

    return allAccountsInfo.allAccounts;
};

export default finalizeReportAccounts;