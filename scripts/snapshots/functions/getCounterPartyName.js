import accounts from '../data/accounts.js';

const getCounterPartyName = (counterParty) => {
    for (const account of accounts) {
      if (account.Address === counterParty) {
        return account.Name;
      }
    }
    return 'External Address';
  };

  export default getCounterPartyName;