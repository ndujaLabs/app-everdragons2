#!/usr/bin/env bash

docker stop app-everdragons2-com
docker rm app-everdragons2-com

docker run -d \
  --name app-everdragons2-com \
  -p 6700 \
  --restart unless-stopped \
  -v $PWD:/usr/src/app \
  -v /vol/log/app-everdragons2-com_app:/var/log/app-everdragons2-com_app \
  --link ed2-postgres:postgres \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=everdragons2.com,app.everdragons2.com \
  -e LETSENCRYPT_HOST=everdragons2.com,app.everdragons2.com \
  -e LETSENCRYPT_EMAIL=everdragons2@sameteam.co \
  -w /usr/src/app node:16 npm run start
