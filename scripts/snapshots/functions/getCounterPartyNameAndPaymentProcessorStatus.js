import accounts from '../data/accounts.js';

const getCounterPartyNameAndPaymentProcessorStatus = (counterParty) => {
  let paymentProcessor = false;

  for (const account of accounts) {
    if (account.Address.toLowerCase() === counterParty.toLowerCase()) {
      if(account.Type === 'PaymentProcessor') {
        paymentProcessor = true;
      }

      return {
        name: account.Name, 
        paymentProcessor
      };
    }
  }

  return {
    name: 'External Address', 
    paymentProcessor
  };
};

export default getCounterPartyNameAndPaymentProcessorStatus;