#!/usr/bin/env bash

source .env && docker exec -it ed2-postgres psql -d $POSTGRES_DB -U postgres
