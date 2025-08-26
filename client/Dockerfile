# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Set npm configuration for better network handling
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5

# Copy package files
COPY package*.json ./

# Install dependencies with better network handling
RUN npm ci --prefer-offline --no-audit --no-fund || \
    (npm cache clean --force && npm ci --prefer-offline --no-audit --no-fund)

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - using nginx for serving static files
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]