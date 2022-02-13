const ethers = require("ethers");
const { Contract } = require("@ethersproject/contracts");
const config = require("../../client/config");
const { infuraApiKey } = require("../../env.json");

module.exports = {
  sleep: async (millis) => {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setTimeout(resolve, millis));
  },

  getContracts() {
    let provider = new ethers.providers.InfuraProvider("matic", infuraApiKey);
    let contracts = {};
    let addresses = config.contracts[137];
    for (let contractName in addresses) {
      contracts[contractName] = new Contract(
        addresses[contractName],
        config.abi[contractName],
        provider
      );
    }
    return contracts;
  },
};
