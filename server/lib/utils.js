const ethers = require("ethers");
const { Contract } = require("@ethersproject/contracts");
const config = require("../../client/config");
// const _ = require("lodash");
const { infuraApiKey, validator } = require("../../env.json");
const dbManager = require("./DbManager");
// cache:
const contracts = {};

const utils = {
  sleep: async (millis) => {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setTimeout(resolve, millis));
  },

  getContracts(testnet) {
    let provider = new ethers.providers.InfuraProvider(
      testnet ? "maticmum" : "matic",
      infuraApiKey
    );
    let contracts = {};
    let addresses = config.contracts[testnet ? 80001 : 137];
    for (let contractName in addresses) {
      contracts[contractName] = new Contract(
        addresses[contractName],
        config.abi[contractName],
        provider
      );
    }
    return contracts;
  },

  getContract(chainId, contractName) {
    chainId = chainId.toString();
    if (config.supportedId[chainId]) {
      if (!contracts[chainId]) {
        contracts[chainId] = {};
      }
      if (!contracts[chainId][contractName]) {
        let provider;
        if (chainId === "1337") {
          provider = new ethers.providers.JsonRpcProvider();
        } else {
          const network =
            chainId === "42"
              ? "kovan"
              : chainId === "137"
              ? "matic"
              : chainId === "80001"
              ? "maticmum"
              : "homestead";
          provider = new ethers.providers.InfuraProvider(
            network,
            process.env.INFURA_API_KEY
          );
        }
        contracts[chainId][contractName] = new Contract(
          config.contracts[chainId][contractName],
          config.abi[contractName],
          provider
        );
      }
      return contracts[chainId][contractName];
    }
    return false;
  },

  signPackedData(hash) {
    const ethers = require("ethers");
    const signingKey = new ethers.utils.SigningKey(validator);
    const signedDigest = signingKey.signDigest(hash);
    return ethers.utils.joinSignature(signedDigest);
  },

  async mintTokenAndSendOneMatic(chainId, nonce, recipient, amount) {
    const farm = utils.getContract(chainId, "GenesisFarm3");
    const provider = new ethers.providers.InfuraProvider(
      chainId === "1" ? "matic" : "maticmum",
      infuraApiKey
    );
    const wallet = new ethers.Wallet(validator, provider);
    const tx = await farm
      .connect(wallet)
      .deliverCrossChainPurchase(nonce, recipient, amount, {
        gasLimit: (80 + 140 * amount) * 1000,
      });
    utils.giveAway1Matic(tx, nonce, wallet, recipient);
    return tx.hash;
  },

  async giveAway1Matic(tx, nonce, wallet, recipient) {
    await tx.wait();
    const transfer = await wallet.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther("0.1"),
    });
    dbManager.confirmMint(nonce, tx.hash, transfer.hash);
  },

  async getPackedHash(chainId, recipient, amount, nonce, cost) {
    const ethereumFarm = utils.getContract(chainId, "EthereumFarm");
    if (!ethereumFarm) {
      return false;
    }
    return await ethereumFarm.encodeForSignature(
      recipient,
      amount,
      nonce,
      cost
    );
  },
};

module.exports = utils;
