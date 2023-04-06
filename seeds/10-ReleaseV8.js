/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Set delegate budget caps
export async function seed(knex) {


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
                address: '0x2dC0420A736D1F40893B9481D8968E4D7424bC0B',
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
        


/*
      const govAlphaCuMipEntry = {
        cuId: 8,
        mipCode: 'MIP40c3SP90',
        mipTitle: 'Budget Ratification Poll for GovAlpha Core Unit DAI Budget 2023-2024 (MIP40c3-SP90) - March 13, 2023',
        rfc: '2023-02-07',
        mipStatus: 'Accepted',
        forumUrl: 'https://forum.makerdao.com/t/mip40c3-sp90-govalpha-core-unit-dai-budget-2023-2024/19712',
        mipUrl: 'https://mips.makerdao.com/mips/details/MIP40c3SP90#sentence-summary',
        accepted: '2023-03-27',
        rejected: null
      };
      
      const [govAlphasId] = await knex('CuMip').insert(govAlphaCuMipEntry).returning('id');
      
      const govAlphaMip40 = {
        cuMipId: govAlphasId,
        mip40Spn: mipCode
      };
      
      await knex('Mip40').insert(govAlphaMip40);

      await knex('CuMip').insert({
        cuId: 20,
        mipCode: 'MIP40c3SP89',
        mipTitle: 'Ratification Poll for Modify Core Unit Budget (DECO-001) (MIP40c3-SP89) - March 13, 2023',
        rfc: '2023-02-06',
        mipStatus: 'Rejected',
        forumUrl: 'https://forum.makerdao.com/t/mip40c3-sp89-modify-core-unit-budget-deco-001/19690',
        mipUrl: 'https://mips.makerdao.com/mips/details/MIP40c3SP89#sentence-summary',
        accepted: null,
        rejected: '2023-03-27'
      });*/

      



    
    }