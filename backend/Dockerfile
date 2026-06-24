# ──────────────────────────────────────────────
# Stage 1: deps
# Install only production dependencies
# ──────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy manifests first for better layer caching
COPY package.json package-lock.json ./

RUN npm ci --omit=dev

# ──────────────────────────────────────────────
# Stage 2: builder
# Install ALL deps (including devDependencies)
# so linting / transpiling can run if needed
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# ──────────────────────────────────────────────
# Stage 3: runner  (final image)
# Lean production image — no dev tooling
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

# Security: run as non-root user
RUN addgroup -S fleet && adduser -S fleet -G fleet

WORKDIR /app

# Copy production node_modules from deps stage
COPY --from=deps  /app/node_modules ./node_modules

# Copy application source from builder stage
COPY --from=builder /app/src        ./src
COPY --from=builder /app/app.js     ./app.js
COPY --from=builder /app/package.json ./package.json

# Ownership
RUN chown -R fleet:fleet /app
USER fleet

# Port your Express app listens on
EXPOSE 5001

# Health check — Docker will mark the container
# unhealthy if /health stops responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:5001/health || exit 1

# Start the server
CMD ["node", "app.js"]