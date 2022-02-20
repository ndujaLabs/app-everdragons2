#!/usr/bin/env node
const _ = require("lodash");
const { execSync } = require("child_process");
const [, , chain, nonce, recipient, amount] = process.argv;
const tx = _.trim(
  execSync(
    `./send-tokens.sh ${chain} ${nonce} ${recipient} ${amount}`
  ).toString()
);
console.info(tx);
