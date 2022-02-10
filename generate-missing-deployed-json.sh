#!/usr/bin/env bash

FILE=./client/config/deployed.json
if [[ -f "$FILE" ]]; then
    echo "deployed.json exists."
else
    echo "{}" > $FILE
fi
