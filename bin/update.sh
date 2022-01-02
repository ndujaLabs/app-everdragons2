#!/usr/bin/env bash

git pull && pnpm i && pnpm run build && docker/node.sh
