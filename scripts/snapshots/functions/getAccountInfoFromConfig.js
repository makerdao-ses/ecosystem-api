import accounts from "../data/accounts.js";

const getAccountInfoFromConfig = (address) => {
  const result = {
    name: "External Address",
    address: address.toLowerCase(),
    type: "External",
    offChain: false,
    isProtocolAddress: false,
  };

  for (const account of accounts) {
    if (account.Address.toLowerCase() === address.toLowerCase()) {
      result.name = account.Name;
      result.type = account.Type;
      result.offChain = account.Type === "PaymentProcessor";
      result.isProtocolAddress = account.Type === "Protocol";
    }
  }

  if (result.address === "0xunknown") {
    result.name = "Unknown External Recipient(s)";
  }

  return result;
};

export default getAccountInfoFromConfig;
