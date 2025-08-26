# Use Node.js 18 with Debian base for better Prisma compatibility
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install dependencies for native modules and OpenSSL
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Set npm configuration for better network handling
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies
RUN npm ci --prefer-offline --no-audit --no-fund || \
    (npm cache clean --force && npm ci --prefer-offline --no-audit --no-fund)

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create non-root user for security
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check for Azure Container Apps
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"] 