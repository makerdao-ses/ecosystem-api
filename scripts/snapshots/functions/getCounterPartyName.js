import accounts from '../data/accounts.js';

const getCounterPartyName = (counterParty) => {
    for (const account of accounts) {
      if (account.Address.toLowerCase() === counterParty.toLowerCase()) {
        return account.Name;
      }
    }
    return 'External Address';
  };

  export default getCounterPartyName;