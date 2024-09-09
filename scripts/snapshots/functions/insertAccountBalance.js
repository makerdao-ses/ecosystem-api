const insertAccountBalances = async (allAccounts, offChainIncluded, knex) => {
  let formattedResponse = [];
  let offChainKey = offChainIncluded ? "offChainIncluded" : "offChainExcluded";

  const tokens = {
    DAI: "DAI",
    MKR: "MKR",
    USDC: "USDC",
    GUSD: "GUSD",
    USDP: "USDP",
    USDT: "USDT",
    USDS: "USDS",
    SKY: "SKY",
  };

  console.log("Updating account balances...");

  for (let i = 0; i < allAccounts.length; i++) {
    for (const key in tokens) {
      if (tokens.hasOwnProperty(key)) {
        const token = tokens[key];

        const idsList = allAccounts[i][offChainKey].internalIds.join(", ");
        const addressesList =
          "'" +
          allAccounts[i][offChainKey].internalAddresses.join("', '") +
          "'";

        if (idsList.length > 0) {
          let result = await knex.raw(`
                SELECT 
                    count(*),
                    round(sum(CASE WHEN sat.amount > 0 THEN sat.amount ELSE 0 END), 2) AS inflow,
                    round(sum(CASE WHEN sat.amount < 0 THEN sat.amount ELSE 0 END), 2) AS outflow
                
                FROM "SnapshotAccountTransaction" as sat
                
                WHERE 
                    sat."snapshotAccountId" in (${idsList})
                    AND NOT lower(sat."counterParty") in (${addressesList})
                    AND sat."token" = '${token}'
            `);

          if (result) {
            const inflow = parseFloat(result.rows[0].inflow || 0);
            const outflow = parseFloat(result.rows[0].outflow || 0);
            const totalAmount = inflow + outflow;

            let initialBalance = 0;

            if (
              allAccounts[i][offChainKey].initialBalanceByToken &&
              allAccounts[i][offChainKey].initialBalanceByToken[token]
            ) {
              initialBalance =
                allAccounts[i][offChainKey].initialBalanceByToken[token];
            }

            if (inflow !== 0 || outflow !== 0 || initialBalance !== 0) {
              console.log(
                allAccounts[i].label,
                token,
                result.rows,
                parseFloat(result.rows[0].inflow) +
                  parseFloat(result.rows[0].outflow),
              );

              // Check if any of the values are non-zero before pushing the entry
              formattedResponse.push({
                snapshotAccountId: allAccounts[i].accountId,
                token: token,
                totalAmount: totalAmount,
                inflow: result.rows[0].inflow || 0.0,
                outflow: result.rows[0].outflow || 0.0,
                initialBalance,
              });
            }
          }
        }
      }
    }
  }

  await Promise.all(
    formattedResponse.map(async (resp) => {
      const query = knex("SnapshotAccountBalance").insert({
        snapshotAccountId: resp.snapshotAccountId,
        token: resp.token,
        initialBalance: resp.initialBalance,
        newBalance: parseFloat(resp.initialBalance) + resp.totalAmount,
        inflow: resp.inflow,
        outflow: resp.outflow,
        includesOffChain: offChainIncluded,
      });

      console.log(query.toString());
      return query;
    }),
  );

  return formattedResponse;
};

export default insertAccountBalances;
