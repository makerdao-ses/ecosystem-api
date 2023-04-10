/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Set delegate budget caps

export async function seed(knex) {

    /*
        const techOpsCuMipEntry = {
            cuId: 22,
            mipCode: 'MIP40c3SP88',
            mipTitle: 'MIP40c3-SP88: TechOps Core Unit DAI Budget',
            rfc: '2022-12-02',
            mipStatus: 'Accepted',
            forumUrl: 'https://forum.makerdao.com/t/mip40c3-sp88-techops-core-unit-dai-budget/19017',
            mipUrl: 'https://mips.makerdao.com/mips/details/MIP40c3SP88#sentence-summary',
            accepted: '2023-03-27',
            rejected: null
          };
          
          const [techOpsMipId] = await knex('CuMip').insert(techOpsCuMipEntry).returning('id').onConflict().ignore();
          
          const techOpsMip40 = {
            cuMipId: techOpsMipId.id,
            mip40Spn: 'MIP40c3SP88'
          };
          
          const [techOpsMip40Id] = await knex('Mip40').insert(techOpsMip40).returning('id');

          await knex ('Mip40BudgetPeriod').insert({
            mip40Id: techOpsMip40Id.id,
            budgetPeriodStart: '2023-04-01',
            budgetPeriodEnd: '2024-03-31',
            ftes: 4.7,});

            const techOpsMipWalletEntry = {
                    mip40Id: techOpsMip40Id.id,
                    address: '0x1a3da79ee7db30466ca752de6a75def5e635b2f6',
                    name: 'TechOps Operational Wallet',
                    signersRequired: 2,
                    signersTotal: 2,
                    clawbackLimit: 1000000000
            };
          
            const [techOpsMipWallet40Id] = await knex('Mip40Wallet').insert(techOpsMipWalletEntry).returning('id'); 
            
            await knex ('Mip40BudgetLineItem').insert([
                {
                mip40WalletId: techOpsMipWallet40Id.id,
                budgetCategory: 'Compensation and Benefits',
                canonicalBudgetCategory: 'CompensationAndBenefits',
                budgetCap: 70447.5,
                headcountExpense: true,
                position: 1
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'Compensation and Benefits',
                    canonicalBudgetCategory: 'SoftwareExpense',
                    budgetCap: 33333.33,
                    headcountExpense: false,
                    position: 11
                    },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'Tools',
                    canonicalBudgetCategory: 'SoftwareExpense',
                    budgetCap: 3333.33,
                    headcountExpense: false,
                    position: 11
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'Gas',
                    canonicalBudgetCategory: 'GasExpense',
                    budgetCap: 2500,
                    headcountExpense: false,
                    position: 5
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'Professional Services',
                    canonicalBudgetCategory: 'ProfessionalServices',
                    budgetCap: 3333.33,
                    headcountExpense: false,
                    position: 9
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'Travel and Accommodation',
                    canonicalBudgetCategory: 'TravelAndEntertainment',
                    budgetCap: 0,
                    headcountExpense: true,
                    position: 3
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'Conferences and Education',
                    canonicalBudgetCategory: 'TrainingExpense',
                    budgetCap: 0,
                    headcountExpense: true,
                    position: 12
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'R&D',
                    canonicalBudgetCategory: 'AdminExpense',
                    budgetCap: 0,
                    headcountExpense: false,
                    position: 2
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'Hardware',
                    canonicalBudgetCategory: 'HardwareExpense',
                    budgetCap: 0,
                    headcountExpense: false,
                    position: 7
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'Integrations',
                    canonicalBudgetCategory: 'SoftwareExpense',
                    budgetCap: 0,
                    headcountExpense: false,
                    position: 11
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'VulcanizeDB',
                    canonicalBudgetCategory: 'SoftwareExpense',
                    budgetCap: 0,
                    headcountExpense: false,
                    position: 11
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'Recruiting',
                    canonicalBudgetCategory: 'ProfessionalServices',
                    budgetCap: 0,
                    headcountExpense: false,
                    position: 9
                },
                {
                    mip40WalletId: techOpsMipWallet40Id.id,
                    budgetCategory: 'Contingency',
                    canonicalBudgetCategory: 'ContingencyBuffer',
                    budgetCap: 1129.5,
                    headcountExpense: false,
                    position: 15
                }]
                );
            
    */


    const [govAlphasId] = await knex('CuMip').where({
        mipCode: 'MIP40c3SP90'
    }).update({
        rfc: '2023-02-07',
        mipStatus: 'Accepted',
        accepted: '2023-03-27',
    }).returning('id');

    const govAlphaMip40 = {
        cuMipId: govAlphasId.id,
        mip40Spn: 'MIP40c3SP90'
    };

    const [govAlphaMip40Id] = await knex('Mip40').insert(govAlphaMip40).returning('id');

    const govAlphaMipWalletEntry = {
        mip40Id: govAlphaMip40Id.id,
        address: '0x01D26f8c5cC009868A4BF66E268c17B057fF7A73',
        name: 'GovAlpha Operational Wallet',
        signersRequired: 2,
        signersTotal: 3,
        clawbackLimit: 1000000000
    };

    const [govAlphaMipWallet40Id] = await knex('Mip40Wallet').insert(govAlphaMipWalletEntry).returning('id');

    await knex('Mip40BudgetPeriod').insert({
        mip40Id: govAlphaMip40Id.id,
        budgetPeriodStart: '2023-04-01',
        budgetPeriodEnd: '2024-03-31',
        ftes: 4,
    });

    await knex('Mip40BudgetLineItem').insert([{
            mip40WalletId: govAlphaMipWallet40Id.id,
            budgetCategory: 'Compensation and Benefits',
            canonicalBudgetCategory: 'CompensationAndBenefits',
            budgetCap: 58520.83,
            headcountExpense: true,
            position: 1
        },
        {
            mip40WalletId: govAlphaMipWallet40Id.id,
            budgetCategory: 'Travel and Accommodation',
            canonicalBudgetCategory: 'TravelAndEntertainment',
            budgetCap: 2666.67,
            headcountExpense: true,
            position: 3
        },
        {
            mip40WalletId: govAlphaMipWallet40Id.id,
            budgetCategory: 'Governance Programs',
            canonicalBudgetCategory: 'GovernancePrograms',
            budgetCap: 6000,
            headcountExpense: false,
            position: 4
        },
        {
            mip40WalletId: govAlphaMipWallet40Id.id,
            budgetCategory: 'Gas',
            canonicalBudgetCategory: 'GasExpense',
            budgetCap: 833.33,
            headcountExpense: false,
            position: 5
        },
        {
            mip40WalletId: govAlphaMipWallet40Id.id,
            budgetCategory: 'Software Expense',
            canonicalBudgetCategory: 'SoftwareExpense',
            budgetCap: 25,
            headcountExpense: false,
            position: 6
        },
        {
            mip40WalletId: govAlphaMipWallet40Id.id,
            budgetCategory: 'Software Development Expense',
            canonicalBudgetCategory: 'SoftwareDevelopmentExpense',
            budgetCap: 500,
            headcountExpense: false,
            position: 8
        },
        {
            mip40WalletId: govAlphaMipWallet40Id.id,
            budgetCategory: 'Contingency',
            canonicalBudgetCategory: 'ContingencyBuffer',
            budgetCap: 6854.583333,
            headcountExpense: false,
            position: 15
        }
    ]);

    const [riskId] = await knex('CuMip').where({
        mipCode: 'MIP40c3SP92'
    }).update({
        rfc: '2023-02-07',
        mipStatus: 'Accepted',
        accepted: '2023-03-27',
    }).returning('id');

    const riskMip40 = {
        cuMipId: riskId.id,
        mip40Spn: 'MIP40c3SP92'
    };

    const [riskMip40Id] = await knex('Mip40').insert(riskMip40).returning('id');

    const riskMipWalletEntry = {
        mip40Id: riskMip40Id.id,
        address: '0xDfe08A40054685E205Ed527014899d1EDe49B892',
        name: 'Risk Operational Wallet',
        signersRequired: 2,
        signersTotal: 3,
        clawbackLimit: 1000000000
    };

    const [riskMip40WalletId] = await knex('Mip40Wallet').insert(riskMipWalletEntry).returning('id');

    await knex('Mip40BudgetPeriod').insert({
        mip40Id: riskMip40Id.id,
        budgetPeriodStart: '2023-03-01',
        budgetPeriodEnd: '2024-02-29',
        ftes: 11
    });


    await knex('Mip40BudgetLineItem').insert([{
            mip40WalletId: riskMip40WalletId.id,
            budgetCategory: 'Compensation and Benefits',
            canonicalBudgetCategory: 'CompensationAndBenefits',
            budgetCap: 166500,
            headcountExpense: true,
            position: 1
        },
        {
            mip40WalletId: riskMip40WalletId.id,
            budgetCategory: 'Software Expenses',
            canonicalBudgetCategory: 'SoftwareExpense',
            budgetCap: 10250,
            headcountExpense: false,
            position: 6
        },
        {
            mip40WalletId: riskMip40WalletId.id,
            budgetCategory: 'Admin Expenses',
            canonicalBudgetCategory: 'AdminExpense',
            budgetCap: 6450,
            headcountExpense: false,
            position: 2
        },
        {
            mip40WalletId: riskMip40WalletId.id,
            budgetCategory: 'Professional Services',
            canonicalBudgetCategory: 'ProfessionalServices',
            budgetCap: 2750,
            headcountExpense: false,
            position: 9
        },
        {
            mip40WalletId: riskMip40WalletId.id,
            budgetCategory: 'Travel',
            canonicalBudgetCategory: 'TravelAndEntertainment',
            budgetCap: 729,
            headcountExpense: true,
            position: 3
        },
        {
            mip40WalletId: riskMip40WalletId.id,
            budgetCategory: 'Contingency',
            canonicalBudgetCategory: 'ContingencyBuffer',
            budgetCap: 20321,
            headcountExpense: false,
            position: 15
        }
    ]);


    const [dinId] = await knex('CuMip').where({
        mipCode: 'MIP40c3SP96'
    }).update({
        rfc: '2023-02-07',
        mipStatus: 'Accepted',
        accepted: '2023-03-27',
    }).returning('id');

    const dinMip40 = {
        cuMipId: dinId.id,
        mip40Spn: 'MIP40c3SP96'
    };

    const [dinMip40Id] = await knex('Mip40').insert(dinMip40).returning('id');

    const dinMipWalletEntry = {
        mip40Id: dinMip40Id.id,
        address: '0x7327aed0ddf75391098e8753512d8aec8d740a1f',
        name: 'DIN Operational Wallet',
        signersRequired: 2,
        signersTotal: 3,
        clawbackLimit: 1000000000
    };

    const [dinMip40WalletId] = await knex('Mip40Wallet').insert(dinMipWalletEntry).returning('id');

    await knex('Mip40BudgetPeriod').insert({
        mip40Id: dinMip40Id.id,
        budgetPeriodStart: '2023-03-01',
        budgetPeriodEnd: '2024-02-29',
        ftes: 11
    });

    await knex('Mip40BudgetLineItem').insert([{
            mip40WalletId: dinMip40WalletId.id,
            budgetCategory: 'Team',
            canonicalBudgetCategory: 'CompensationAndBenefits',
            budgetCap: 40500.0375,
            headcountExpense: true,
            position: 10
        },
        {
            mip40WalletId: dinMip40WalletId.id,
            budgetCategory: 'Infrastructure',
            canonicalBudgetCategory: 'SoftwareExpense',
            budgetCap: 24300.0225,
            headcountExpense: false,
            position: 6
        },
        {
            mip40WalletId: dinMip40WalletId.id,
            budgetCategory: 'Operational',
            canonicalBudgetCategory: 'SoftwareExpense',
            budgetCap: 7290.00675,
            headcountExpense: false,
            position: 6
        },
        {
            mip40WalletId: dinMip40WalletId.id,
            budgetCategory: 'Data',
            canonicalBudgetCategory: 'SoftwareExpense',
            budgetCap: 5670.00525,
            headcountExpense: false,
            position: 6
        },
        {
            mip40WalletId: dinMip40WalletId.id,
            budgetCategory: 'Contingency',
            canonicalBudgetCategory: 'ContingencyBuffer',
            budgetCap: 3240.003,
            headcountExpense: false,
            position: 15
        }
    ]);

}