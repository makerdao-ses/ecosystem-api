# builder
FROM node:22.10-alpine as builder

RUN npm install -g typescript

WORKDIR /app
COPY package.json package-lock.json knexfile.js ./
RUN npm install

COPY . ./
RUN tsc -p ./config/tsconfig.json

# runner
FROM node:22.10-alpine as runner

RUN npm install -g knex

WORKDIR /app
COPY --from=builder /app/ ./

ENTRYPOINT [ "node" ]
