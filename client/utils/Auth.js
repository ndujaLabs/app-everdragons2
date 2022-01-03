import { utils } from "ethers";

class Auth {
  async getSignedAuthToken(chainId, signer, data = {}) {
    if (typeof data !== "string") {
      data = JSON.stringify(data, null, 2);
    }
    const authToken = utils
      .keccak256(Buffer.from(Math.random().toString()))
      .substring(0, 16);

    const timestamp = Date.now();
    const msgParams = JSON.stringify({
      domain: {
        chainId: chainId,
        name: "Everdragons2 NFT",
        version: "1",
      },
      message: {
        authToken,
        timestamp,
        data,
      },
      primaryType: "Auth",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
        ],
        Auth: [
          { name: "authToken", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "data", type: "string" },
        ],
      },
    });
    const params = [signer, msgParams];
    const method = "eth_signTypedData_v4";

    const signature = await window.ethereum.request({
      method,
      params,
      from: signer,
    });
    return { msgParams, signature };
  }
}

export default new Auth();
