const express = require("express");
const router = express.Router();

router.get("/tokens", async (req, res) => {
  res.json({
    success: true,
  });
});

module.exports = router;
