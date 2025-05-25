FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl postgresql-client && apt-get clean

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node . .

RUN npm run db:generate && npm run build