FROM node:22-alpine AS base

WORKDIR /app

# Copy only these first to leverage Docker cache
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable

# Compile TS
FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Install production dependencies
FROM base AS deps
RUN pnpm install --prod --frozen-lockfile

# Bare minimum image for production
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules

CMD ["npm", "start"]
