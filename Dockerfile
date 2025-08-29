# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps (use npm ci for reproducible builds)
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ---- Runtime stage (Nginx) ----
FROM nginx:1.27-alpine

# SPA-friendly nginx config with caching for hashed assets
RUN /bin/sh -lc 'cat >/etc/nginx/conf.d/default.conf << "EOF"\n\
    server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    \n\
    # Gzip/basic perf\n\
    gzip on;\n\
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;\n\
    \n\
    # Cache hashed assets for a year\n\
    location ~* ^/assets/ { expires 1y; add_header Cache-Control \"public, immutable\"; try_files $uri =404; }\n\
    location ~* \\.(?:woff2?|ttf|otf|eot|png|jpg|jpeg|gif|webp|avif|svg)$ { expires 1y; add_header Cache-Control \"public, immutable\"; try_files $uri =404; }\n\
    \n\
    # Everything else: serve index.html (SPA fallback)\n\
    location / {\n\
    try_files $uri /index.html;\n\
    }\n\
    }\n\
    EOF'

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

EXPOSE 80
