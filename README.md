# ql-api

### Quickstart

Easily run all services using `docker-compose`. This will run Postgres, Redis, and the Ecosystem API server.

```
# copy .env example file
cp .env.example .env

# startup
docker-compose -f docker-compose.yml -f docker-compose.api.yml up
```

A GraphQL explorer will now be available at [http://localhost:4000](http://localhost:4000).

### Development

For local development, we run dependencies via `docker-compose`, while using familiar tools like file-watchers locally.

```
docker-compose up -d

npm install
npm run dev
```

This will make a GraphQL explorer available at [http://localhost:4000](http://localhost:4000), which will reload the API on every local file change.

### Clearing the Development DB

The local DB running via `docker compose` writes to the `./db` path. This means that to nuke the database and start again from an empty one, simply `rm -rf .db`. This is common before a DB migration, as detailed below.

### DB Migration

A DB copy tool is available that leverages containers to export and import data without needing any tools installed locally.

```
# start the database
docker-compose up -d

# dumps from db specified with parameters, into that db
./dump-db.sh <user> <password> <host> <db>
```

This exports from the target instance and imports into the locally running postgres instance.

### Environment Variables

The following environment variables are supported:

| Name                  | Description | Default | Required  |
| -                     | -           | -       | -         |
| SECRET                | | | |
| REFRESH_CACHE_SECRET  | | | |
| PORT                  | Port to run API on. | `3000` | NO |
| PG_CONNECTION_STRING  | Connection string for Postgres. | `""` | YES |
| REDIS_TLS_URL         | Connection string for Redis. | `""` | YES |
| DEBUG                 | True to turn on debug logging. | `false` | No |