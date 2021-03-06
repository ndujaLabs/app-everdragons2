const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const dbManager = require("../lib/DbManager");
const {
  getContract,
  signPackedData,
  getPackedHash,
  mintTokenAndSendOneMatic,
  getCrossChainId,
} = require("../lib/utils");

async function getTotalSupply(chainId) {
  const Everdragons2Genesis = getContract(chainId, "Everdragons2Genesis");
  return (await Everdragons2Genesis.totalSupply()).toNumber();
}

function getEtherPrice(chainId) {
  return chainId === "1" ? 0.06 : 0.001;
}

router.get("/get-current-status", async (req, res) => {
  let { chainId } = req.query;
  const totalSupply = await getTotalSupply(getCrossChainId(chainId));
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
  const price = getEtherPrice(chainId);
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
  try {
    const mintingTx = await mintTokenAndSendOneMatic(
      chainId,
      nonce,
      buyer,
      quantity
    );

    return res.json({
      success: true,
      mintingTx,
    });
  } catch (e) {
    // console.error(e);
    res.json({
      success: false,
      error: e.message,
    });
  }
});

module.exports = router;
