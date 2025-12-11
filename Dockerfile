# Multi-stage Dockerfile for Next.js (production, standalone)

FROM node:20-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

# Needed for some native deps and sharp on alpine
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
# Install all deps (including dev) to build the app
RUN yarn install --frozen-lockfile

FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build the Next.js app (outputs standalone server)
RUN yarn build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy the standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
