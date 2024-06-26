const setTransactionLabels = async (
  allAccountsInfo,
  upstreamDownstream,
  knex,
) => {
  const distinctInternalAddresses = Array.from(
    new Set(
      allAccountsInfo
        .map((item) => item.offChainIncluded.internalAddresses)
        .flat(),
    ),
  );

  const upstreamSet = upstreamDownstream.upstreamSet;
  const downstreamSet = upstreamDownstream.downstreamSet;

  const upstreamFlat = Object.values(upstreamSet).flat();
  const downstreamFlat = Object.values(downstreamSet).flat();

  const combinedArray = [...upstreamFlat, ...downstreamFlat];
  const flatIds = Array.from(new Set(combinedArray));

  await knex("SnapshotAccountTransaction")
    .whereIn("snapshotAccountId", flatIds)
    .whereIn("counterParty", distinctInternalAddresses)
    .update({
      txLabel: "Internal Transaction",
    });

  await knex("SnapshotAccountTransaction")
    .whereIn("snapshotAccountId", flatIds)
    .whereNotIn("counterParty", distinctInternalAddresses)
    .update({
      txLabel: "External Transaction",
    });

  for (const key in upstreamSet) {
    if (upstreamSet.hasOwnProperty(key)) {
      const valueArray = upstreamSet[key];
      let internalAddressesList = [];

      for (const value of valueArray) {
        const obj = allAccountsInfo.find(
          (item) => item.accountId === parseInt(key),
        );
        if (obj) {
          obj.offChainIncluded.internalAddresses.forEach((address) => {
            if (!internalAddressesList.includes(address)) {
              internalAddressesList.push(address);
            }
          });
        } else {
          console.log(`No object found with id ${value}`);
        }
      }

      if (internalAddressesList.length > 0) {
        for (const value of valueArray) {
          await knex("SnapshotAccountTransaction")
            .where("snapshotAccountId", value)
            .where("txLabel", "Internal Transaction")
            .whereIn("counterParty", internalAddressesList)
            .where("amount", "<=", 0)
            .update({
              txLabel: "Top-up",
            });

          await knex("SnapshotAccountTransaction")
            .where("snapshotAccountId", value)
            .where("txLabel", "Internal Transaction")
            .whereIn("counterParty", internalAddressesList)
            .where("amount", ">", 0)
            .update({
              txLabel: "Return of Excess Funds",
            });
        }
      }
    }
  }

  for (const key in downstreamSet) {
    if (downstreamSet.hasOwnProperty(key)) {
      const valueArray = downstreamSet[key];
      let internalAddressesDownstreamList = [];

      for (const value of valueArray) {
        const obj = allAccountsInfo.find(
          (item) => item.accountId === parseInt(key),
        );
        if (obj) {
          obj.offChainIncluded.internalAddresses.forEach((address) => {
            if (!internalAddressesDownstreamList.includes(address)) {
              internalAddressesDownstreamList.push(address);
            }
          });
        } else {
          console.log(`No object found with id ${value}`);
        }
      }

      if (internalAddressesDownstreamList.length > 0) {
        for (const value of valueArray) {
          await knex("SnapshotAccountTransaction")
            .where("snapshotAccountId", value)
            .where("txLabel", "Internal Transaction")
            .whereIn("counterParty", internalAddressesDownstreamList)
            .where("amount", ">", 0)
            .update({
              txLabel: "Top-up",
            });

          await knex("SnapshotAccountTransaction")
            .where("snapshotAccountId", value)
            .where("txLabel", "Internal Transaction")
            .whereIn("counterParty", internalAddressesDownstreamList)
            .where("amount", "<=", 0)
            .update({
              txLabel: "Return of Excess Funds",
            });
        }
      }
    }
  }
};

export default setTransactionLabels;
