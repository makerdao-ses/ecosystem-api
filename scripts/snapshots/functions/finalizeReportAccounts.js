const getAccountTypeGroup = (accountType) => {
    const mapping = {
        "DSSVest": "DSSVest",
        "Auditor": "Auditor",
        "Operational": "Operational",
        "Emergency": "Operational",
        "Accountant": "Operational",
        "PaymentProcessor": "PaymentProcessor",
    };
    const key = ("" + accountType).trim() || "Operational";

    if (!mapping[key]) {
        throw new Error(`Unsupported account type for group name: "${accountType}"`);
    }
    return mapping[key];
};

const getGroupUpstream = (groupName, allAccounts) => {
    const mapping = {
        "PaymentProcessor": [
            "Protocol",
            "DSSVest",
            "Auditor",
            "Operational"
        ],
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
    const upstreamSet = {};
    const downstreamSet = {};
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

            upstreamSet[allAccountsInfo.allAccounts[i].id] = [upstreamGroupId];
            if(!downstreamSet[upstreamGroupId]){
                downstreamSet[upstreamGroupId] = [];
            }
            downstreamSet[upstreamGroupId].push(allAccountsInfo.allAccounts[i].id);

        }
    }
    let updates;
    do {
        updates = false;
        for(const k in upstreamSet){
            const newSet = new Set();
            for(let i = 0; i < upstreamSet[k].length; i++){
                newSet.add(upstreamSet[k][i]);
                (upstreamSet[upstreamSet[k][i]]||[]).forEach(element => {
                    newSet.add(element);
                });
            }
            if(newSet.size > upstreamSet[k].length){
                updates = true;
                upstreamSet[k] = [...newSet];
            }
            newSet.forEach(e => {
                if(!downstreamSet[e]){
                    downstreamSet[e] = [];
                }
                const intK = parseInt(k);
                if(downstreamSet[e].indexOf(intK) < 0){
                    downstreamSet[e].push(intK);
                }
            });
        }
    } while (updates);

    return {upstreamSet, downstreamSet};
};



const createGroupAccount = async (snapshotReport, label, groupAccountId, offChain, knex) => {

        // Entry does not exist, perform insert
        let insert = await knex('SnapshotAccount')
            .insert({
                snapshotId: snapshotReport.id,
                accountLabel: label,
                accountType: 'group',
                accountAddress: '0xGROUP',
                groupAccountId: groupAccountId,
                offChain: offChain
            })
            .returning('id');
        let groupId = insert[0].id;
    
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
    let singularAccountsAddresses = {
        onChain: [],
        offChain: []
    };
    let singularAccountsIds = {
        onChain: [],
        offChain: []
    };

    for (let i = 0; i < singularAccounts.length; i++) {
        console.log('Processing singular account ',singularAccounts[i]);
        const newAccount = {
            id: singularAccounts[i].accountId,
            group: getAccountTypeGroup(singularAccounts[i].type),
            internalAddresses: [
                singularAccounts[i].address.toLowerCase()
            ],
            internalIds: [singularAccounts[i].accountId]
        };
        accountsInfo.allAccounts.push(newAccount);
        const key = newAccount.offChain?'offChain':'onChain';
        singularAccountsAddresses[key].push(newAccount.internalAddresses[0]);
        singularAccountsIds[key].push(newAccount.internalIds[0]);
    }

    const coreUnitReservesAccountId = await createGroupAccount(snapshotReport, 'Core Unit Reserves', null, false, knex);
    const coreUnitReservesAccount =  {
        id: coreUnitReservesAccountId,
        group: 'Reserve',
        internalAddresses: singularAccountsAddresses.onChain.concat(singularAccountsAddresses.offChain),
        internalIds: [coreUnitReservesAccountId].concat(singularAccountsIds.onChain).concat(singularAccountsIds.offChain)
    };
    accountsInfo.allAccounts.push(coreUnitReservesAccount);
    accountsInfo.groupUpstreamIds.Reserve = coreUnitReservesAccountId;

    const onchainAccountId = await createGroupAccount(snapshotReport, 'On-Chain Reserves', coreUnitReservesAccountId, false, knex);
    accountsInfo.allAccounts.push({
        id: onchainAccountId,
        group: 'Reserve',
        internalAddresses: singularAccountsAddresses.onChain,
        internalIds: [onchainAccountId].concat(singularAccountsIds.onChain)
    });
    coreUnitReservesAccount.internalIds.push(onchainAccountId);

    const offchainAccountId = await createGroupAccount(snapshotReport, 'Off-Chain Reserves', coreUnitReservesAccountId, true, knex);
    accountsInfo.allAccounts.push({
        id: offchainAccountId,
        group: 'Reserve',
        internalAddresses: singularAccountsAddresses.offChain,
        internalIds: [offchainAccountId].concat(singularAccountsIds.offChain)
    });
    coreUnitReservesAccount.internalIds.push(offchainAccountId);

    const groupAccountMapping = {};
    for (let i = 0; i < singularAccounts.length; i++) {
        const groupName = getAccountTypeGroup(singularAccounts[i].type);
        if (!groupAccountMapping[groupName]) {
            groupAccountMapping[groupName] = singularAccounts[i].offChain ? offchainAccountId : onchainAccountId;
            accountsInfo.groupUpstreamIds[groupName] = singularAccounts[i].accountId;
        } else if (groupAccountMapping[groupName] === onchainAccountId || groupAccountMapping[groupName] === offchainAccountId) {
            if(groupAccountMapping[groupName] === onchainAccountId){
                groupAccountMapping[groupName] = await createGroupAccount(snapshotReport, groupName, onchainAccountId, false, knex);
            }
            else{
                groupAccountMapping[groupName] = await createGroupAccount(snapshotReport, groupName, offchainAccountId, true, knex);
            }
            
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

    const upstreamDownstreamMap = await updateUpstreamIds(allAccountsInfo, knex);
    console.log(upstreamDownstreamMap);

    return allAccountsInfo.allAccounts;
};

export default finalizeReportAccounts;