#!/usr/bin/env bash

docker stop everdragons2-com
docker rm everdragons2-com

docker run -d \
  --name everdragons2-com \
  -p 8040 \
  --restart unless-stopped \
  -e VIRTUAL_HOST=everdragons2.com,www.everdragons2.com \
  -e LETSENCRYPT_HOST=everdragons2.com,www.everdragons2.com \
  -e LETSENCRYPT_EMAIL=francescosullo@sameteam.co \
  -v `pwd`/domain-redirect/html:/usr/share/nginx/html:ro -d nginx
