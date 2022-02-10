const { supportedId } = require("../config");

const network = {
  // defaults to Polygon PoS
  async switchTo(chainId) {
    const chain = supportedId[chainId];
    chainId = chain.chainId;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                ...chain,
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      } else {
        console.error(switchError);
      }
      // handle other "switch" errors
    }
  },

  decodeMetamaskError(message) {
    try {
      if (/denied transaction signature/.test(message)) {
        return ["You denied transaction signature :-("];
      }
      let tmp = message.split('{"code":')[1].split(",");
      // let code = tmp[0]
      let res = tmp[1].split('"message":"')[1].split('"')[0].split(/: */);
      let reason = res.slice(1).join(": ");
      reason = reason.substring(0, 1).toUpperCase() + reason.substring(1);
      return [res[0] + ".", reason];
    } catch (e) {
      return ["VM Exception while processing transaction :-("];
    }
  },
};

module.exports = network;
