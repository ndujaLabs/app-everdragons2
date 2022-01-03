#!/usr/bin/env bash

# curl https://raw.githubusercontent.com/jwilder/nginx-proxy/master/nginx.tmpl > /vol/etc/nginx/templates/nginx.tmpl

docker stop nginx
docker rm nginx

docker stop nginx-gen
docker rm nginx-gen

docker stop nginx-letsencrypt
docker rm nginx-letsencrypt

docker rmi nginx jwilder/docker-gen jrcs/letsencrypt-nginx-proxy-companion

