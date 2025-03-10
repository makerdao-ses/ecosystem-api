# builder
FROM node:22.5-alpine AS builder

RUN npm install -g typescript pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml knexfile.js ./
RUN pnpm install

COPY . ./
RUN tsc -p ./config/tsconfig.json

# runner
FROM node:22.5-alpine AS runner

RUN npm install -g knex

WORKDIR /app
COPY --from=builder /app/ ./

ENTRYPOINT [ "node" ]
