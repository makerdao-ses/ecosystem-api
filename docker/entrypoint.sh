#!/bin/sh
set -e

# Run migrations if not skipped
if [ "$SKIP_DB_MIGRATIONS" != "true" ] && [ -n "$PG_CONNECTION_STRING" ]; then
    echo "[entrypoint] Running database migrations..."
    knex migrate:latest --knexfile ./knexfile.js
    echo "[entrypoint] Migrations completed"
fi

echo "[entrypoint] Starting ecosystem-api on port ${PORT:-4000}..."
exec node ./build/index.js
