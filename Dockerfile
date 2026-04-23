FROM node:18-alpine AS base

# Backend build
FROM base AS backend-build
WORKDIR /app/backend
COPY backend/package.json ./
RUN npm install
COPY backend/ ./

# Frontend build
FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npx next build

# Production
FROM base AS production
WORKDIR /app

# Install PM2
RUN npm install -g pm2

# Copy backend
COPY --from=backend-build /app/backend /app/backend
WORKDIR /app/backend
RUN npm install --production

# Copy frontend build
COPY --from=frontend-build /app/frontend/.next /app/frontend/.next
COPY --from=frontend-build /app/frontend/public /app/frontend/public
COPY --from=frontend-build /app/frontend/package.json /app/frontend/package.json
COPY --from=frontend-build /app/frontend/node_modules /app/frontend/node_modules

# Create data directory for JSON DB
RUN mkdir -p /app/backend/data

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/frontend && PORT=3000 node_modules/.bin/next start &' >> /app/start.sh && \
    echo 'sleep 3' >> /app/start.sh && \
    echo 'cd /app/backend && node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 3000 3001

# Start both services
CMD ["/app/start.sh"]
