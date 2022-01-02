#!/usr/bin/env bash

source .env && docker run -it --rm \
  --name app-everdragons2-com-dev \
  -p 6700 \
  -v $PWD:/usr/src/app \
  -v $PWD/log:/var/log/app-everdragons2-com \
  --link ed2-postgres:postgres \
  -e NODE_ENV=development \
  -e VIRTUAL_HOST=everdragons2.com.local,app.everdragons2.com.local \
  -w /usr/src/app node:16 npm run start
