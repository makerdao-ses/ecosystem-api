export async function seed(knex) {
  const teams = [
    'DECO-001',
    'DIN-001',
    'ORA-001',
    'PE-001',
    'RISK-001',
    'SF-001',
    'SAS-001',
    'SNE-001',
    'TECH-001',
    'GRO-001',
    'IS-001',
    'SES-001'
  ];

  return knex('CoreUnit')
    .whereIn('code', teams)
    .andWhere('type', 'CoreUnit')
    .andWhere('status', 'Accepted')
    .update({ status: 'Obsolete' })
    .then(() => {
      console.log('Status updated to Obsolete for the specified CoreUnits');
    });
};