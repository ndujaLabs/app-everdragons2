#!/usr/bin/env bash

(
cd everdragons2-core
USEMATICKEY=1 NONCE=$2 RECIPIENT=$3 AMOUNT=$4 npx hardhat run scripts/deliver.js --network $1
)
