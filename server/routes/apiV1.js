const express = require("express");
const router = express.Router();
const { coordinates } = require("../config");
const sigUtil = require("eth-sig-util");
const DiscordOauth2 = require("discord-oauth2");
const dbManager = require("../lib/DbManager");
const Address = require("../../client/utils/Address");

function areCoordinatesCorrect(solutions) {
  for (let i = 0; i < solutions.length; i++) {
    let coord = coordinates[i];
    for (let j = 0; j < 2; j++) {
      if (Math.abs(coord[j] - solutions[i][j]) > 1) {
        return false;
      }
    }
  }
  return true;
}

// for testing in InputSolutions
//   coord0: [37.060748, -121.934391].join(','),
//   coord1: [50.412943, 130.420468].join(','),
//   coord2: [32.016318, 130.938638].join(','),
//   coord3: [77.355538, -109.168444].join(','),
//   coord4: [-24.411339, 137.408074].join(','),
//   coord5: [6.526514, 48.867394].join(','),
//   coord6: [11.235225, 159.024462].join(','),
//   coord7: [36.964837, -111.308187].join(','),
//   coord8: [-3.556187, -67.611479].join(','),
//   coord9: [39.151746, 16.39408].join(',')

router.post("/verify-solutions", async (req, res) => {
  const connectedWallet = req.get("Connected-wallet");
  // const chainId = req.get("Chain-id");
  const msgParams = JSON.parse(req.body.msgParams);
  const recovered = sigUtil.recoverTypedSignature_v4({
    data: msgParams,
    sig: req.body.signature,
  });
  if (!Address.equal(recovered, connectedWallet)) {
    return res.json({
      success: false,
      actionRequired: "connect",
      error: "Wrong signature",
    });
  }
  const data = JSON.parse(msgParams.message.data);
  const { accessToken, userId, solutions } = data;
  if (!areCoordinatesCorrect(JSON.parse(solutions))) {
    return res.json({
      success: false,
      error: "Wrong coordinates",
    });
  }
  const oauth = new DiscordOauth2();
  const user = await oauth.getUser(accessToken);
  if (!user || user.id !== userId) {
    return res.json({
      success: false,
      actionRequired: "login",
      error: "Discord user not found. Please log in again",
    });
  }
  try {
    let score = (await dbManager.newWhitelisted(user, connectedWallet))[0];
    return res.json({
      success: true,
      score,
    });
  } catch (e) {
    // console.log(e)
    res.json({
      success: false,
      error: "User/wallet has already submitted a solution",
    });
  }
});

module.exports = router;
