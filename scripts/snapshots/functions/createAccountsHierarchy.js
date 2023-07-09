const createAccountsHierarchy = async (snapshotReport, singularAccounts, protocolAccountId, makerProtocolAddresses, knex) => {
    console.log(`\nCreating accounts hierarchy for ${singularAccounts.length} singular accounts in report with ID: ${snapshotReport.id}`);

    // Keep track of account IDs
    const accountIds = {
        protocolAccountId
    };

    // Create top level group accounts
    accountIds.rootAccountId = 
        await createGroupAccount(snapshotReport, 'Root', null, false, knex);
    accountIds.coreUnitReservesAccountId = 
        await createGroupAccount(snapshotReport, 'Core Unit Reserves', accountIds.rootAccountId, false, knex);
    accountIds.onchainAccountId = 
        await createGroupAccount(snapshotReport, 'On-Chain Reserves', accountIds.coreUnitReservesAccountId, false, knex);
    accountIds.offchainAccountId = 
        await createGroupAccount(snapshotReport, 'Off-Chain Reserves', accountIds.coreUnitReservesAccountId, true, knex);

    // Create the allAccountsInfo data structure and initialize it with the singular accounts
    const allAccountsInfo = {
        allAccounts: initializeAllAccountsMapping (
            singularAccounts.filter(a => (a.accountId || 0) > 0), 
            protocolAccountId, 
            makerProtocolAddresses
        ),

        // This keeps track of the upstream account IDs for downstream accounts to point at,
        // when they need to point at a given group. For example, if an auditor account needs
        // to point at the Protocol group for its upstreamAccountId, it should set 
        // upstreamAccountId = upstreamAccountIdsByGroup[Protocol]
        upstreamAccountIdsByGroup: {
            Protocol: protocolAccountId,
            Root: accountIds.rootAccountId,
            Reserve: accountIds.coreUnitReservesAccountId,
        }
    };

    // Create new group accounts for grouping singular accounts
    const { newGroupAccountsInfo, newUpstreamAccountIdsByGroup } = 
        await groupSingularAccounts (snapshotReport, accountIds, allAccountsInfo.allAccounts, knex);

    // Update upstream account ids
    allAccountsInfo.upstreamAccountIdsByGroup = {...allAccountsInfo.upstreamAccountIdsByGroup, ...newUpstreamAccountIdsByGroup };

    // Combine singular accounts, singular account group accounts, and top-level group accounts into one
    allAccountsInfo.allAccounts = allAccountsInfo.allAccounts
        .concat(newGroupAccountsInfo)
        .concat(calculateTopLevelGroupAccountsInfo(allAccountsInfo, newGroupAccountsInfo, accountIds));

    // Write upstreamAccountIds to database and capture the calculated set
    const upstreamSet = await setUpstreamAccountIds(allAccountsInfo, knex);
    
    // 
    return {
        allAccounts: allAccountsInfo.allAccounts,
        upstreamDownstreamMap: {
            upstreamSet,
            downstreamSet: calculateDownstreamSet(upstreamSet)
        }
    };
};

const createGroupAccount = async (snapshotReport, label, groupAccountId, offChain, knex) => {
    const newAccount = await knex('SnapshotAccount')
        .insert({
            snapshotId: snapshotReport.id,
            accountLabel: label,
            accountType: 'group',
            groupAccountId: groupAccountId,
            offChain: offChain
        })
        .returning('id');

    console.log(` ...created new ${offChain ? 'OFF-CHAIN ' : ''}group account '${label}' with ID '${newAccount[0].id}'. Parent group ID is ${groupAccountId}.`);
    return newAccount[0].id;
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
            }
        };

        // Add additional internal addresses for the Maker Protocol Account
        if (result.accountId === protocolAccountId) {
            result.offChainIncluded.internalAddresses = [...makerProtocolAddresses];
            result.offChainExcluded.internalAddresses = [...makerProtocolAddresses];
        }

        // Clean up by removing some older collections (performance optimization)
        if (result.protocolTransactions) {
            delete result.protocolTransactions;
        }
        if (result.paymentProcessorTransactions) {
            delete result.paymentProcessorTransactions;
        }

        //
        return result;
    });

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

const groupSingularAccounts = async (snapshotReport, accountIds, singularAccountsInfo, knex) => {
    // Keep track of the groupAccountIds for singular accounts of each group so we can set them later
    const groupAccountMapping = {
        // Protocol account(s) should point at accountIds.rootAccountId as groupAccountId
        'Protocol': accountIds.rootAccountId,
        // PaymentProcessor account(s) should point at accountIds.offchainAccountId as groupAccountId
        'PaymentProcessor': accountIds.offchainAccountId,
    };

    // Collect newly created group accounts
    const newGroupAccountsInfo = [];
    const upstreamAccountIdsByGroup = {};

    for (let i=0; i<singularAccountsInfo.length; i++) {
        const account = singularAccountsInfo[i];
        const groupName = account.group;

        // Only attempt to group accounts within the Core Unit Reserves groups,
        // not the protocol or payment process accounts. (May need to extend this later.)
        if (['Operational', 'Auditor', 'DSSVest'].indexOf(groupName) < 0) {
            continue;
        }

        // First time we encounter an account of this group -- no need to create a group account yet
        if (!groupAccountMapping[groupName]) {
            // Assign it directly to the on-chain or off-chain reserves parent group
            groupAccountMapping[groupName] = account.offChain ? accountIds.offchainAccountId : accountIds.onchainAccountId;
            // Designate it as the upstream account to point at for downstream accounts of this group 
            upstreamAccountIdsByGroup[groupName] = account.accountId;

        // Second time we encounter an account of this group -- need to create a group account for it
        } else if (
            groupAccountMapping[groupName] === accountIds.onchainAccountId || 
            groupAccountMapping[groupName] === accountIds.offchainAccountId
        ) {
            const childAccounts = singularAccountsInfo.filter(a => a.group == groupName);
            console.log(` ...creating new group account for ${childAccounts.length} '${groupName}' accounts`);

            // Create a common group account for the child accounts in this group
            if (groupAccountMapping[groupName] === accountIds.onchainAccountId) {
                // On-chain accounts
                groupAccountMapping[groupName] = await createGroupAccount(snapshotReport, groupName, accountIds.onchainAccountId, false, knex);
            } else {
                // Off-chain accounts
                groupAccountMapping[groupName] = await createGroupAccount(snapshotReport, groupName, accountIds.offchainAccountId, true, knex);
            }

            // Designate the new group account as the upstream account to point at for downstream accounts of this group 
            upstreamAccountIdsByGroup[groupName] = groupAccountMapping[groupName];

            // Calculate the new group account's information based on its children
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

            newGroupAccountsInfo.push(newAccount);
        }
    }

    // Write the calculated groupAccountIds to the database
    await setSingularAccountsGroupIds(singularAccountsInfo, groupAccountMapping, knex);

    // Return all info about the newly created accounts + identified upstreamAccountIds
    return {
        newGroupAccountsInfo,
        newUpstreamAccountIdsByGroup: upstreamAccountIdsByGroup
    };
}

const setSingularAccountsGroupIds = async (singularAccountsInfo, groupAccountMapping, knex) => {
    console.log(` ...updating groupAccountId of ${singularAccountsInfo.length} singular accounts`);

    for (let i = 0; i < singularAccountsInfo.length; i++) {
        const groupName = singularAccountsInfo[i].group;

        if (!groupName) {
            console.error(` ...ERROR: expected group to be set on singular account`, singularAccountsInfo[i]);

        } else if (!groupAccountMapping[groupName]) {
            console.error(` ...ERROR: expected groupAccountId for group '${groupName}' set in `, groupAccountMapping);
        
        } else {
            await knex('SnapshotAccount')
                .where('id', '=', singularAccountsInfo[i].accountId)
                .update({
                    groupAccountId: groupAccountMapping[groupName]
                });
        }
    }
}

const calculateTopLevelGroupAccountsInfo = (singularAccountsInfo, otherGroupAccounts, accountIds) => {
    const newGroupAccountsInfo = [];

    const onChainReserveChildrenIds = [
        singularAccountsInfo.upstreamAccountIdsByGroup['Operational'],
        singularAccountsInfo.upstreamAccountIdsByGroup['Auditor'],
        singularAccountsInfo.upstreamAccountIdsByGroup['DSSVest']
    ].filter(id => id > 0);

    newGroupAccountsInfo.push({
        label: 'On-Chain Reserves',
        type: 'Reserve',
        group: 'Reserve',
        address: '0xGROUP',
        ...calculateParentFromDirectChildren(
            singularAccountsInfo.allAccounts.concat(otherGroupAccounts).filter(a => onChainReserveChildrenIds.indexOf(a.accountId) > -1), 
            accountIds.onchainAccountId
        )
    });

    newGroupAccountsInfo.push({
        label: 'Off-Chain Reserves',
        type: 'Reserve',
        group: 'Reserve',
        address: '0xGROUP',
        ...calculateParentFromDirectChildren(
            singularAccountsInfo.allAccounts.filter(a => a.group == 'PaymentProcessor'), 
            accountIds.offchainAccountId
        )
    });

    newGroupAccountsInfo.push({
        label: 'Core Unit Reserves',
        type: 'Reserve',
        group: 'Reserve',
        address: '0xGROUP',
        ...calculateParentFromDirectChildren(
            newGroupAccountsInfo.filter(a => [accountIds.offchainAccountId, accountIds.onchainAccountId].indexOf(a.accountId) > -1), 
            accountIds.coreUnitReservesAccountId
        )
    });

    newGroupAccountsInfo.push({
        label: 'Root',
        type: 'Root',
        group: 'Root',
        address: '0xGROUP',
        ...calculateParentFromDirectChildren(
            singularAccountsInfo.allAccounts.concat(newGroupAccountsInfo).filter(a => [accountIds.coreUnitReservesAccountId, accountIds.protocolAccountId].indexOf(a.accountId) > -1), 
            accountIds.rootAccountId
        )
    });

    return newGroupAccountsInfo;
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

const setUpstreamAccountIds = async (allAccountsInfo, knex) => {
    const upstreamSet = {};
    const downstreamSet = {};
    
    console.log(` ...updating upstreamAccountId of ${allAccountsInfo.allAccounts.length} accounts`);
    for (let i = 0; i < allAccountsInfo.allAccounts.length; i++) {
        const upstreamGroupName = getGroupUpstream(allAccountsInfo.allAccounts[i].group, allAccountsInfo.allAccounts);

        if (upstreamGroupName !== null) {
            const upstreamGroupId = allAccountsInfo.upstreamAccountIdsByGroup[upstreamGroupName];
            
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

    return upstreamSet;
};

const calculateDownstreamSet = (upstreamSet) => {
    const downstreamSet = {};

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

    return downstreamSet;
}


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

export default createAccountsHierarchy;