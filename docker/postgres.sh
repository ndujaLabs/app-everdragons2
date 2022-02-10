#!/usr/bin/env bash

source .env && docker run -d \
    --name ed2-postgres \
    --restart unless-stopped \
    -p 5433:5432 \
    -v $PGDATA:/var/lib/postgresql/data/pgdata \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_DB=$POSTGRES_DB \
    postgres:13


