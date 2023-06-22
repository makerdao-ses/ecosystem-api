import knex from 'knex';
import scopeArtifacts from './scopeArtifactsData.js';
import fs from 'fs';


// Connect to database selected in the .env file
const db = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    idleTimeoutMillis: 0,
});

// console.log(scopeArtifacts)

/* Required values to fill in DB:

Budget: 
    - parentId
    - name
    - code
    - start
    - end

BudgetCap:
    - budgetId
    - expenseCategoryId
    - amount
    - currency
*/


function structureData(data) {
    let hierarchy = {};
    let currentL0, currentL1, currentL2, currentL3, currentL4;

    data.forEach(item => {
        if (item.L0) {
            currentL0 = item.L0;
            hierarchy[currentL0] = {};
        }
        if (item.L1) {
            currentL1 = item.L1;
            if (!hierarchy[currentL0]) hierarchy[currentL0] = {};
            hierarchy[currentL0][currentL1] = {};
        }
        if (item.L2) {
            currentL2 = item.L2;
            if (!hierarchy[currentL0][currentL1]) hierarchy[currentL0][currentL1] = {};
            hierarchy[currentL0][currentL1][currentL2] = {};
        }
        if (item.L3) {
            currentL3 = item.L3;
            if (!hierarchy[currentL0][currentL1][currentL2]) hierarchy[currentL0][currentL1][currentL2] = {};
            hierarchy[currentL0][currentL1][currentL2][currentL3] = item;
        }
        if (item.L4) {
            currentL4 = item.L4;
            console.log(item.L4)
            // if (!hierarchy[currentL0][currentL1][currentL2][currentL3]) hierarchy[currentL0][currentL1][currentL2][currentL3] = {};
            // hierarchy[currentL0][currentL1][currentL2][currentL3][currentL4] = item;
        } else if (currentL3) {
            // if (!hierarchy[currentL0][currentL1][currentL2]) hierarchy[currentL0][currentL1][currentL2] = {};
            // hierarchy[currentL0][currentL1][currentL2][currentL3] = item;
        }
    });

    return hierarchy;
}

let structuredData = structureData(scopeArtifacts);
structuredData
console.log(structuredData);

// const writeToFile = (data) => {
//     fs.writeFile('scopeArtifacts.json', JSON.stringify(data), (err) => {
//         if (err) throw err;
//         console.log('The file has been saved!');
//     });
// };

// writeToFile(structuredData);