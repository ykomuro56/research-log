#!/bin/sh
set -eu

APP_DB_PASSWORD="$(cat /run/secrets/app_db_password)"
export APP_DB_PASSWORD
test -n "$APP_DB_PASSWORD"

psql -X --set=ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" <<'SQL'
\getenv app_password APP_DB_PASSWORD

CREATE ROLE researchlog LOGIN PASSWORD :'app_password';
ALTER DATABASE research_log OWNER TO researchlog;
SQL

unset APP_DB_PASSWORD
