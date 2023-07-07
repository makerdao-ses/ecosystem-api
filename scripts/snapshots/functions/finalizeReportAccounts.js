const getAccountTypeGroup = (accountType) => {
    const mapping = {
        "DSSVest": "DSSVest",
        "Auditor": "Auditor",
        "Operational": "Operational",
        "Emergency": "Operational",
        "Accountant": "Operational",
        "PaymentProcessor": "PaymentProcessor",
        "Protocol": "Protocol",
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
        ],
        "Root": [
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
            console.log(allAccountsInfo.allAccounts[i].accountId, "=>", upstreamGroupName, upstreamGroupId);

            await knex('SnapshotAccount')
                .where('id', '=', allAccountsInfo.allAccounts[i].accountId)
                .update({
                    upstreamAccountId: upstreamGroupId
                });

            upstreamSet[allAccountsInfo.allAccounts[i].accountId] = [upstreamGroupId];
            if (!downstreamSet[upstreamGroupId]) {
                downstreamSet[upstreamGroupId] = [];
            }
            downstreamSet[upstreamGroupId].push(allAccountsInfo.allAccounts[i].accountId);

        }
    }
    let updates;
    do {
        updates = false;
        for (const k in upstreamSet) {
            const newSet = new Set();
            for (let i = 0; i < upstreamSet[k].length; i++) {
                newSet.add(upstreamSet[k][i]);
                (upstreamSet[upstreamSet[k][i]] || []).forEach(element => {
                    newSet.add(element);
                });
            }
            if (newSet.size > upstreamSet[k].length) {
                updates = true;
                upstreamSet[k] = [...newSet];
            }
            newSet.forEach(e => {
                if (!downstreamSet[e]) {
                    downstreamSet[e] = [];
                }
                const intK = parseInt(k);
                if (downstreamSet[e].indexOf(intK) < 0) {
                    downstreamSet[e].push(intK);
                }
            });
        }
    } while (updates);

    return {
        upstreamSet,
        downstreamSet
    };
};

const createGroupAccount = async (snapshotReport, label, groupAccountId, offChain, knex) => {

    // Entry does not exist, perform insert
    let insert = await knex('SnapshotAccount')
        .insert({
            snapshotId: snapshotReport.id,
            accountLabel: label,
            accountType: 'group',
            groupAccountId: groupAccountId,
            offChain: offChain
        })
        .returning('id');
    let groupId = insert[0].id;

    return groupId;
};

const initializeAllAccountsMapping = 
    (singularAccounts, protocolAccountId, makerProtocolAddresses) => singularAccounts.map(inputAccount => {
        const result = {
            ...inputAccount,
            group: getAccountTypeGroup(inputAccount.type),
            offChainIncluded: {
                internalIds: [inputAccount.accountId],
                internalAddresses: [inputAccount.address.toLowerCase()],
                initialBalanceByToken: {...inputAccount.initialBalanceByToken},
                finalBalanceByToken: {...inputAccount.finalBalanceByToken},
            },
            offChainExcluded: {
                internalIds: (inputAccount.offChain ? [] : [inputAccount.accountId]),
                internalAddresses: (inputAccount.offChain ? [] : [inputAccount.address.toLowerCase()]),
                initialBalanceByToken:  (inputAccount.offChain ? {} : {...inputAccount.initialBalanceByToken}),
                finalBalanceByToken: (inputAccount.offChain ? {} : {...inputAccount.finalBalanceByToken}),
            },
            groupAccountId: null,
            upstreamAccountId: null,
        };

        // Add additional internal addresses for the Maker Protocol Account
        if (result.accountId === protocolAccountId) {
            result.offChainIncluded.internalAddresses = [...makerProtocolAddresses];
            result.offChainExcluded.internalAddresses = [...makerProtocolAddresses];
        }

        // Clean up by removing some older collections
        if (result.protocolTransactions) {
            delete result.protocolTransactions;
        }
        if (result.paymentProcessorTransactions) {
            delete result.paymentProcessorTransactions;
        }

        //
        return result;
    });

const mergeAddObjects = (a, b) => {
    const result = {...a};
    Object.keys(b).forEach(k => result[k] = (result[k] ? result[k] + b[k] : b[k]));
    return result;
}

const calculateParentFromDirectChildren = (childAccounts, parentId) => {
    const result = {
        accountId: parentId, 

        offChain: childAccounts.map(c => c.offChain)
            .reduce((prev, next) => prev && next, true),
        
        addedTransactions: childAccounts.map(c => c.addedTransactions)
            .reduce((prev, next) => prev + next, 0),

        timespan: {
            start: childAccounts.map(c => c.timespan.start)
                .reduce((prev, next) => prev && (prev < next) ? prev : next, false),
            end: childAccounts.map(c => c.timespan.end)
                .reduce((prev, next) => prev && (prev > next) ? prev : next, false),
        },

        offChainIncluded: {
            initialBalanceByToken: childAccounts.map(c => c.offChainIncluded.initialBalanceByToken)
                .reduce((prev, next) => mergeAddObjects(prev, next), {}),
            finalBalanceByToken: childAccounts.map(c => c.offChainIncluded.finalBalanceByToken)
                .reduce((prev, next) => mergeAddObjects(prev, next), {}),
            internalIds: childAccounts.map(c => c.offChainIncluded.internalIds)
                .reduce((prev, next) => prev.concat(next), [parentId]),
            internalAddresses: childAccounts.map(c => c.offChainIncluded.internalAddresses)
            .reduce((prev, next) => prev.concat(next), []),
        },

        offChainExcluded: {
            initialBalanceByToken: childAccounts.map(c => c.offChainExcluded.initialBalanceByToken)
                .reduce((prev, next) => mergeAddObjects(prev, next), {}),
            finalBalanceByToken: childAccounts.map(c => c.offChainExcluded.finalBalanceByToken)
                .reduce((prev, next) => mergeAddObjects(prev, next), {}),
            internalIds: childAccounts.map(c => c.offChainExcluded.internalIds)
                .reduce((prev, next) => prev.concat(next), [parentId]),
            internalAddresses: childAccounts.map(c => c.offChainExcluded.internalAddresses)
            .reduce((prev, next) => prev.concat(next), []),
        },
    };


    return result;
}

const createGroupAccounts = async (snapshotReport, singularAccounts, protocolAccountId, makerProtocolAddresses, knex) => {
    const accountsInfo = {
        allAccounts: initializeAllAccountsMapping(singularAccounts, protocolAccountId, makerProtocolAddresses),
        groupUpstreamIds: {
            Protocol: protocolAccountId
        }
    };

    const rootAccountId = await createGroupAccount(snapshotReport, 'Root', null, false, knex);
    const coreUnitReservesAccountId = await createGroupAccount(snapshotReport, 'Core Unit Reserves', rootAccountId, false, knex);
    const onchainAccountId = await createGroupAccount(snapshotReport, 'On-Chain Reserves', coreUnitReservesAccountId, false, knex);
    const offchainAccountId = await createGroupAccount(snapshotReport, 'Off-Chain Reserves', coreUnitReservesAccountId, true, knex);

    accountsInfo.groupUpstreamIds.Root = rootAccountId;
    accountsInfo.groupUpstreamIds.Reserve = coreUnitReservesAccountId;

    // Keep track of the groupAccountIds for singular accounts
    const groupAccountMapping = {
        'Protocol': rootAccountId,
        'PaymentProcessor': offchainAccountId,
    };

    // Collect newly created group accounts
    const groupAccounts = [];

    for (let i=0; i<accountsInfo.allAccounts.length; i++) {
        const account = accountsInfo.allAccounts[i];
        const groupName = account.group;

        // Skip accounts outside of the Core Unit Reserves groups
        if (['Operational', 'Auditor', 'DSSVest'].indexOf(groupName) < 0) {
            continue;
        }

        // First time we encounter an account of this group
        if (!groupAccountMapping[groupName]) {
            // Assign it to the on-chain or off-chain reserves parent group
            groupAccountMapping[groupName] = account.offChain ? offchainAccountId : onchainAccountId;
            // Designate it as the upstream account to point at for downstream accounts of this group 
            accountsInfo.groupUpstreamIds[groupName] = account.accountId;

        // Second time we encounter an account of this group
        } else if (
            groupAccountMapping[groupName] === onchainAccountId || 
            groupAccountMapping[groupName] === offchainAccountId
        ) {
            // Create a common parent account for the (two or more) accounts in this group
            if (groupAccountMapping[groupName] === onchainAccountId) {
                groupAccountMapping[groupName] = await createGroupAccount(snapshotReport, groupName, onchainAccountId, false, knex);
            } else {
                groupAccountMapping[groupName] = await createGroupAccount(snapshotReport, groupName, offchainAccountId, true, knex);
            }

            accountsInfo.groupUpstreamIds[groupName] = groupAccountMapping[groupName];
            const childAccounts = accountsInfo.allAccounts.filter(a => a.group == groupName);
            const newAccount = {
                accountId: groupAccountMapping[groupName],
                type: groupName,
                label: groupName,
                group: groupName,
                address: '0xGROUP',
                ...calculateParentFromDirectChildren(
                    childAccounts, 
                    groupAccountMapping[groupName]
                )
            };

            console.log(` ...new group account created for ${childAccounts.length} '${groupName}' accounts`);
            groupAccounts.push(newAccount);
        }
    }

    groupAccounts.push({
        label: 'Off-Chain Reserves',
        type: 'Reserve',
        group: 'Reserve',
        address: '0xGROUP',
        ...calculateParentFromDirectChildren(
            accountsInfo.allAccounts.filter(a => a.group == 'PaymentProcessor'), 
            offchainAccountId
        )
    });

    const onChainReserveChildrenIds = [
        accountsInfo.groupUpstreamIds['Operational'],
        accountsInfo.groupUpstreamIds['Auditor'],
        accountsInfo.groupUpstreamIds['DSSVest']
    ].filter(id => id > 0);

    groupAccounts.push({
        label: 'On-Chain Reserves',
        type: 'Reserve',
        group: 'Reserve',
        address: '0xGROUP',
        ...calculateParentFromDirectChildren(
            accountsInfo.allAccounts.concat(groupAccounts).filter(a => onChainReserveChildrenIds.indexOf(a.accountId) > -1), 
            onchainAccountId
        )
    });

    groupAccounts.push({
        label: 'Core Unit Reserves',
        type: 'Reserve',
        group: 'Reserve',
        address: '0xGROUP',
        ...calculateParentFromDirectChildren(
            groupAccounts.filter(a => [offchainAccountId, onchainAccountId].indexOf(a.accountId) > -1), 
            coreUnitReservesAccountId
        )
    });

    groupAccounts.push({
        label: 'Root',
        type: 'Root',
        group: 'Root',
        address: '0xGROUP',
        ...calculateParentFromDirectChildren(
            accountsInfo.allAccounts.concat(groupAccounts).filter(a => [coreUnitReservesAccountId, protocolAccountId].indexOf(a.accountId) > -1), 
            rootAccountId
        )
    });

    for (let i = 0; i < singularAccounts.length; i++) {
        const groupName = getAccountTypeGroup(singularAccounts[i].type);
        await knex('SnapshotAccount')
            .where('id', '=', singularAccounts[i].accountId)
            .update({
                groupAccountId: groupAccountMapping[groupName]
            });
    }

    return {
        allAccounts: accountsInfo.allAccounts.concat(groupAccounts),
        groupUpstreamIds: accountsInfo.groupUpstreamIds
    }
};

const finalizeReportAccounts = async (snapshotReport, singularAccounts, protocolAccountId, makerProtocolAddresses, knex) => {
    console.log(`Finalising report for id:${snapshotReport.id}`);

    const filteredSingularAccounts = singularAccounts.filter(a => (a.accountId || 0) > 0);

    const allAccountsInfo = await createGroupAccounts(snapshotReport, filteredSingularAccounts, protocolAccountId, makerProtocolAddresses, knex);
    const allAccounts = allAccountsInfo.allAccounts;

    console.log('All Accounts Info: ', ...allAccountsInfo.allAccounts);
    console.log('Upstream Account Ids:', allAccountsInfo.groupUpstreamIds);

    const upstreamDownstreamMap = await updateUpstreamIds(allAccountsInfo, knex);
    console.log(upstreamDownstreamMap);

    return {
        allAccounts,
        upstreamDownstreamMap
    };
};

export default finalizeReportAccounts;