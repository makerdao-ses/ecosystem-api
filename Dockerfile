# Use Bun image
FROM oven/bun:latest

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN bun install

# Copy the rest of the application code
COPY . ./

# Start the application
CMD ["bun", "run", "./src/index.ts"]
