FROM node:18-alpine AS base

# Install dependencies
RUN apk add --no-cache libc6-compat

# ---- Backend ----
FROM base AS backend
WORKDIR /app/backend
COPY backend/package.json ./
RUN npm install
COPY backend/ ./

# ---- Frontend ----
FROM base AS frontend
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
ENV NEXT_PUBLIC_API_URL=http://localhost:3001
RUN npx next build

# ---- Production ----
FROM base AS production
WORKDIR /app

# Install PM2 for process management
RUN npm install -g pm2

# Copy backend
COPY --from=backend /app/backend /app/backend

# Copy frontend
COPY --from=frontend /app/frontend/.next /app/frontend/.next
COPY --from=frontend /app/frontend/public /app/frontend/public
COPY --from=frontend /app/frontend/package.json /app/frontend/package.json
COPY --from=frontend /app/frontend/node_modules /app/frontend/node_modules

# Create data directory
RUN mkdir -p /app/backend/data

# Create PM2 ecosystem config
RUN cat > /app/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'ugova-backend',
      cwd: '/app/backend',
      script: 'server.js',
      env: {
        PORT: 3001,
        NODE_ENV: 'production',
        JWT_SECRET: 'ugova_jwt_secret_2024'
      }
    },
    {
      name: 'ugova-frontend',
      cwd: '/app/frontend',
      script: 'node_modules/.bin/next',
      args: 'start',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'http://localhost:3001'
      }
    }
  ]
};
EOF

# Expose frontend port
EXPOSE 3000

# Start with PM2
CMD ["pm2-runtime", "/app/ecosystem.config.js"]
