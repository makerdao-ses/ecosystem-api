# builder
FROM node:22.5-alpine AS builder

RUN npm install -g typescript

WORKDIR /app
COPY package.json package-lock.json knexfile.js ./
RUN npm ci

COPY . ./
RUN tsc -p ./config/tsconfig.json

# runner
FROM node:22.5-alpine AS runner

RUN apk add --no-cache curl
RUN npm install -g knex

WORKDIR /app
COPY --from=builder /app/ ./
COPY docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT}/healthz || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
