# STAGE 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# npm ci is faster and strictly follows package-lock.json (vs npm install)
RUN npm ci

COPY . .

RUN npm run build


# STAGE 2: Production
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

# Install production dependencies only — excludes eslint, jest, ts-node, etc.
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Drop root privileges — node:alpine ships with a built-in least-privilege user
USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
