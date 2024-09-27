#!/bin/sh

export $(grep -v '^#' .env | xargs)

export DATABASE_URL=$DATABASE_DOCKER_URL

until pg_isready -h pg -p 5432 -U docker
do
  echo "Esperando o banco de dados ficar pronto..."
  sleep 2
done

npm run db:migrate

npm run start
