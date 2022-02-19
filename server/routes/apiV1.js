const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const dbManager = require("../lib/DbManager");
const {
  getContracts,
  signPackedData,
  getPackedHash,
  getContract,
  mintTokenAndSendOneMatic,
} = require("../lib/utils");

async function getTotalSupply(chainId) {
  const contracts = getContracts(chainId !== "1");
  const { Everdragons2Genesis } = contracts;
  return (await Everdragons2Genesis.totalSupply()).toNumber();
}

function getEtherPrice() {
  return 0.06;
}

router.get("/get-current-status", async (req, res) => {
  const { chainId } = req.query;
  const totalSupply = await getTotalSupply(chainId);
  res.json({
    success: true,
    totalSupply,
  });
});

router.post("/authorize-purchase", async (req, res) => {
  const connectedWallet = req.get("Connected-wallet");
  const chainId = req.get("Chain-id");
  // const totalSupply = await getTotalSupply(chainId);
  const amount = parseInt(req.body.amount);
  const price = getEtherPrice();
  const cost = ethers.utils.parseEther("" + price * amount);
  const nonce = (
    await dbManager.getNonce(chainId, connectedWallet, amount, cost.toString())
  )[0];
  let hash = await getPackedHash(chainId, connectedWallet, amount, nonce, cost);
  if (hash) {
    let signature = await signPackedData(hash);
    await dbManager.saveHashAndSignature(nonce, hash, signature);
    return res.json({
      success: true,
      nonce,
      cost: cost.toString(),
      signature,
    });
  } else {
    return res.json({
      success: false,
      error: "Cannot connect to blockchain",
    });
  }
});

router.post("/mint-token", async (req, res) => {
  const chainId = req.get("Chain-id");
  const { nonce } = req.body;
  const info = await dbManager.getInfo(nonce);
  if (!info) {
    return res.json({
      success: false,
      message: "Authorization not found",
    });
  }
  if (info.minted_at) {
    return res.json({
      success: false,
      message: "Already minted",
    });
  }
  const ethereumFarm = getContract(chainId, "EthereumFarm");

  const { buyer, quantity } = await ethereumFarm.purchasedTokens(nonce);
  await dbManager.confirmPurchase(nonce);
  const mintingTx = await mintTokenAndSendOneMatic(
    chainId === 1 ? 137 : 80001,
    nonce,
    buyer,
    quantity
  );

  return res.json({
    success: true,
    mintingTx,
  });
});

module.exports = router;
