FROM node:18-alpine AS base
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

RUN npm install -g pm2

# Copy backend
COPY --from=backend /app/backend /app/backend
RUN cd /app/backend && npm install --production

# Copy frontend
COPY --from=frontend /app/frontend/.next /app/frontend/.next
COPY --from=frontend /app/frontend/package.json /app/frontend/package.json
COPY --from=frontend /app/frontend/node_modules /app/frontend/node_modules

# Create data directory
RUN mkdir -p /app/backend/data

# PM2 ecosystem config
RUN echo 'module.exports = {' > /app/ecosystem.config.js && \
    echo '  apps: [' >> /app/ecosystem.config.js && \
    echo '    {' >> /app/ecosystem.config.js && \
    echo '      name: "ugova-backend",' >> /app/ecosystem.config.js && \
    echo '      cwd: "/app/backend",' >> /app/ecosystem.config.js && \
    echo '      script: "server.js",' >> /app/ecosystem.config.js && \
    echo '      env: { PORT: 3001, NODE_ENV: "production", JWT_SECRET: "ugova_jwt_secret_2024" }' >> /app/ecosystem.config.js && \
    echo '    },' >> /app/ecosystem.config.js && \
    echo '    {' >> /app/ecosystem.config.js && \
    echo '      name: "ugova-frontend",' >> /app/ecosystem.config.js && \
    echo '      cwd: "/app/frontend",' >> /app/ecosystem.config.js && \
    echo '      script: "node_modules/.bin/next",' >> /app/ecosystem.config.js && \
    echo '      args: "start",' >> /app/ecosystem.config.js && \
    echo '      env: { PORT: 3000, NODE_ENV: "production", NEXT_PUBLIC_API_URL: "http://localhost:3001" }' >> /app/ecosystem.config.js && \
    echo '    }' >> /app/ecosystem.config.js && \
    echo '  ]' >> /app/ecosystem.config.js && \
    echo '};' >> /app/ecosystem.config.js

EXPOSE 3000

CMD ["pm2-runtime", "/app/ecosystem.config.js"]
