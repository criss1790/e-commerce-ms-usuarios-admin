#!/bin/sh
echo "NODE_ENV=$NODE_ENV" > .env
echo "MONGO_URL=$MONGO_URL" >> .env
exec "$@"
