import accounts from '../data/accounts.js';

const getCounterPartyName = (counterParty) => {
  let paymentProcessor;
    for (const account of accounts) {
      if (account.Address.toLowerCase() === counterParty.toLowerCase()) {
        if(account.Type === 'PaymentProcessor'){
          paymentProcessor = true;
        }
        return {name: account.Name, paymentProcessor: paymentProcessor};
      }
    }
    return {name: 'External Address', paymentProcessor: paymentProcessor};
  };

  export default getCounterPartyName;