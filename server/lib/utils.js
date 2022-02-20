const ethers = require("ethers");
const { Contract } = require("@ethersproject/contracts");
const config = require("../../client/config");
const { execSync } = require("child_process");
const path = require("path");
const _ = require("lodash");
const {
  infuraApiKey,
  validator,
  // maticvigilKey
} = require("../../env.json");

const dbManager = require("./DbManager");
// cache:
const contracts = {};

// class FastProvider extends ethers.providers.InfuraProvider {
//   async getGasPrice() {
//     const gasPrice = await super.getGasPrice();
//     return gasPrice.add(gasPrice.div(5));
//   }
// }

const utils = {
  sleep: async (millis) => {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setTimeout(resolve, millis));
  },

  getProvider(chainId) {
    chainId = chainId.toString();
    let provider;
    if (chainId === "1337") {
      provider = new ethers.providers.JsonRpcProvider();
      // } else if (chainId === "137") {
      //   provider = new ethers.providers.AlchemyProvider("matic", alchemyKey);
    } else {
      const network =
        chainId === "42"
          ? "kovan"
          : chainId === "137"
          ? "matic"
          : chainId === "80001"
          ? "maticmum"
          : "homestead";
      provider = new ethers.providers.InfuraProvider(network, infuraApiKey);
    }
    return provider;
  },

  getContract(chainId, contractName) {
    chainId = chainId.toString();
    if (config.supportedId[chainId]) {
      if (!contracts[chainId]) {
        contracts[chainId] = {};
      }
      if (!contracts[chainId][contractName]) {
        contracts[chainId][contractName] = new Contract(
          config.contracts[chainId][contractName],
          config.abi[contractName],
          utils.getProvider(chainId)
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

  getCrossChainId(chainId) {
    chainId = chainId.toString();
    return chainId.toString() === "1"
      ? "137"
      : chainId.toString() === "42"
      ? "80001"
      : chainId;
  },

  async mintTokenAndSendOneMatic(chainId, nonce, recipient, amount) {
    chainId = utils.getCrossChainId(chainId);
    const farm = utils.getContract(chainId, "GenesisFarm3");
    if (await farm.usedNonces(nonce)) {
      throw new Error("Tokens already minted");
    }
    const nextTokenId = (await farm.nextTokenId()).toNumber();
    const maxTokenId = (await farm.maxTokenId()).toNumber();
    if (nextTokenId + amount - 1 > maxTokenId) {
      throw new Error("Not enough tokens left :-(");
    }

    const scriptPath = path.resolve(__dirname, "../../sendTokens.js");
    const chain =
      chainId === "137"
        ? "matic"
        : chainId === "80001"
        ? "mumbai"
        : "localhost";
    let tx;
    try {
      tx = _.trim(
        execSync(
          `${scriptPath} ${chain} ${nonce} ${recipient} ${amount}`
        ).toString()
      );
    } catch (e) {
      console.error(e)
      throw new Error("Transaction not created");
    }
    if (/^0x[a-f0-9]{64}/i.test(tx)) {
      dbManager.confirmMint(nonce, tx);
      return tx;
    } else {
      throw new Error("Transaction failed");
    }
  },

  async giveAway1Matic(tx, nonce, wallet, recipient, amount) {
    // await tx.wait();
    const transfer = await wallet.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther(amount),
    });
    // await transfer.wait();
    dbManager.confirmMint(nonce, tx.hash, transfer.hash);
    console.debug("all done");
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
