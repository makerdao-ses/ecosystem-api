#!/bin/sh

PG_VERSION=15.8

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
  echo "Usage: $0 <user> <password> <host> <db>"
  exit 1
fi

mkdir -p dump

echo 'Exporting from remote database...'
docker run -v $PWD/dump:/dump -e POSTGRES_PASSWORD=password -e PGPASSWORD=$2 postgres:$PG_VERSION-alpine pg_dump -h ${3} -p 5432 -U $1 -d $4 -f /dump/dump.sql

echo 'Importing into local database...'
docker compose up db -d --remove-orphans
docker run -v $PWD/dump:/dump -e POSTGRES_PASSWORD=password -e PGPASSWORD=pwd postgres:$PG_VERSION-alpine psql -h host.docker.internal -p 5444 -U makerdao -d EcosystemApi -f /dump/dump.sql
docker compose down
