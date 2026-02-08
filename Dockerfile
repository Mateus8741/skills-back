# ---- Builder ----
FROM node:20-slim AS builder

RUN apt-get update -y && apt-get install -y openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependências (usa npm; o projeto tem bun.lock, então instalação sem lock do npm)
COPY package.json bun.lock* package-lock.json* ./
RUN npm install

COPY . .

# Gerar Prisma Client e build
RUN npx prisma generate && npm run build

# ---- Production ----
FROM node:20-slim AS runner

RUN apt-get update -y && apt-get install -y openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Só o necessário para rodar
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/generated ./generated
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma.config.ts ./

EXPOSE ${PORT}

CMD ["node", "dist/server.js"]
