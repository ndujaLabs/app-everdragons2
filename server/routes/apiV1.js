const express = require("express");
const router = express.Router();
const { getContracts } = require("../lib/utils");

router.get("/get-current-status", async (req, res) => {
  const contracts = await getContracts();
  const { Everdragons2Genesis } = contracts;
  const totalSupply = (await Everdragons2Genesis.totalSupply()).toNumber();
  res.json({
    success: true,
    totalSupply,
  });
});

module.exports = router;
