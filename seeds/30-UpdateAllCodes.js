/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Add the AAVE Ecosystem EA

export async function seed(knex) {

    // Updates existing entries
    return knex.transaction(async function(trx) {
      const entriesToUpdate = [
        { Name: "BALabs", Type: "EcosystemActor", Code: "BAL-001", Short_Code: "BAL" },
        { Name: "Chronicle Labs", Type: "EcosystemActor", Code: "CHL-001", Short_Code: "CHL" },
        { Name: "DevPool", Type: "EcosystemActor", Code: "DVP-001", Short_Code: "DVP" },
        { Name: "Dewiz", Type: "EcosystemActor", Code: "DEW-001", Short_Code: "DEW" },
        { Name: "Gallagher", Type: "EcosystemActor", Code: "GAL-001", Short_Code: "GAL" },
        { Name: "Ecosystem", Type: "EcosystemActor", Code: "ECO-001", Short_Code: "ECO" },
        { Name: "Governance Alpha", Type: "EcosystemActor", Code: "GVL-001", Short_Code: "GVL" },
        { Name: "Growth", Type: "EcosystemActor", Code: "GRW-001", Short_Code: "GRW" },
        { Name: "Jetstream", Type: "EcosystemActor", Code: "JTS-001", Short_Code: "JTS" },
        { Name: "L2BEAT", Type: "EcosystemActor", Code: "L2B-001", Short_Code: "L2B" },
        { Name: "Phoenix Labs", Type: "EcosystemActor", Code: "PHX-001", Short_Code: "PHX" },
        { Name: "Pointable", Type: "EcosystemActor", Code: "PNT-001", Short_Code: "PNT" },
        { Name: "Powerhouse", Type: "EcosystemActor", Code: "PH-001", Short_Code: "PH" },
        { Name: "PullUp Labs", Type: "EcosystemActor", Code: "PUL-001", Short_Code: "PUL" },
        { Name: "Sidestream Auction Services", Type: "EcosystemActor", Code: "SSA-001", Short_Code: "SSA" },
        { Name: "Solidi Labs", Type: "EcosystemActor", Code: "SLL-001", Short_Code: "SLL" },
        { Name: "StableLab", Type: "EcosystemActor", Code: "SBL-001", Short_Code: "SBL" },
        { Name: "Steakhouse", Type: "EcosystemActor", Code: "STH-001", Short_Code: "STH" },
        { Name: "Viridian Protector Advisory Company", Type: "EcosystemActor", Code: "VPAC-001", Short_Code: "VPAC" },
        { Name: "VoteWizard", Type: "EcosystemActor", Code: "VWZ-001", Short_Code: "VWZ" },
        { Name: "Endgame Edge", Type: "EcosystemActor", Code: "EGE-001", Short_Code: "EGE" },
        { Name: "JanSky", Type: "EcosystemActor", Code: "JSK-001", Short_Code: "JSK" },
        { Name: "TechOps", Type: "EcosystemActor", Code: "TCH-001", Short_Code: "TO" },
        { Name: "Dai Foundation", Type: "CoreUnit", Code: "DAIF-001", Short_Code: "DAIF" },
        { Name: "Data Insights", Type: "CoreUnit", Code: "DIN-001", Short_Code: "DIN" },
        { Name: "Deco Protocol", Type: "CoreUnit", Code: "DECO-001", Short_Code: "DECO" },
        { Name: "Growth", Type: "CoreUnit", Code: "GRO-001", Short_Code: "GRO" },
        { Name: "Immunefi Security", Type: "CoreUnit", Code: "IS-001", Short_Code: "IS" },
        { Name: "Oracles", Type: "CoreUnit", Code: "ORA-001", Short_Code: "ORA" },
        { Name: "Protocol Engineering", Type: "CoreUnit", Code: "PE-001", Short_Code: "PE" },
        { Name: "Risk", Type: "CoreUnit", Code: "RISK-001", Short_Code: "RISK" },
        { Name: "Sidestream Auction Services", Type: "CoreUnit", Code: "SAS-001", Short_Code: "SAS" },
        { Name: "Starknet Engineering", Type: "CoreUnit", Code: "SNE-001", Short_Code: "SNE" },
        { Name: "Strategic Finance", Type: "CoreUnit", Code: "SF-001", Short_Code: "SF" },
        { Name: "Sustainable Ecosystem Scaling", Type: "CoreUnit", Code: "SES-001", Short_Code: "SES" },
        { Name: "TechOps", Type: "CoreUnit", Code: "TECH-001", Short_Code: "TECH" },
        { Name: "Collateral Engineering Services", Type: "CoreUnit", Code: "CES-001", Short_Code: "CES" },
        { Name: "Content Production", Type: "CoreUnit", Code: "MKT-001", Short_Code: "MKT" },
        { Name: "Development & UX", Type: "CoreUnit", Code: "DUX-001", Short_Code: "DUX" },
        { Name: "Events", Type: "CoreUnit", Code: "EVENTS-001", Short_Code: "EVT" },
        { Name: "Governance Alpha", Type: "CoreUnit", Code: "GOV-001", Short_Code: "GOV" },
        { Name: "Governance Communications", Type: "CoreUnit", Code: "COM-001", Short_Code: "COM" },
        { Name: "Real-World Finance", Type: "CoreUnit", Code: "RWF-001", Short_Code: "RWF" },
        { Name: "Strategic Happiness", Type: "CoreUnit", Code: "SH-001", Short_Code: "SH" }
      ];
  
      for (const entry of entriesToUpdate) {
        const updatedEntryCount = await trx('CoreUnit')
          .where({ name: entry.Name, type: entry.Type })
          .update({ code: entry.Code, 'shortCode': entry.Short_Code });
  
        if (updatedEntryCount > 0) {
          console.log(`Updated Code and Short Code for ${entry.Name} (${entry.Type})`);
        } else {
          console.log(`No entries found for ${entry.Name} (${entry.Type}). Skipping update.`);
        }
      }
    });
  }
