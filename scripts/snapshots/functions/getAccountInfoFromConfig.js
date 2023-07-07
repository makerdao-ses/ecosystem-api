import accounts from '../data/accounts.js';

const getAccountInfoFromConfig = (address) => {
  const result = {
    name: 'External Address',
    address: address.toLowerCase(),
    category: 'External',
    offChain: false,
    isProtocolAddress: false
  };

  for (const account of accounts) {
    if (account.Address.toLowerCase() === address.toLowerCase()) {
      result.name = account.Name;
      result.category = account.Type;
      result.offChain = (account.Type === 'PaymentProcessor');
      result.isProtocolAddress = (account.Type === 'Protocol');
    }
  }

  return result;
}

export default getAccountInfoFromConfig;