#!/usr/bin/env bash

host=everdragons2-com

if [[ $1 != '' ]]; then
  host=$1
fi

docker exec -it $host bash
