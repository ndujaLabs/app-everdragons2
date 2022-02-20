#!/usr/bin/env bash

pm2 start index.js -i max --name app-e2 && pm2 save
