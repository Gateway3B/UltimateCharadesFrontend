# ---- Build stage ----
FROM node:16.14.0-alpine AS build-step

RUN mkdir -p /app
WORKDIR /app

# Copy only package files first (leverages Docker layer caching)
COPY package.json package-lock.json* /app/
RUN npm ci --legacy-peer-deps

# Copy all source and build
COPY . /app
RUN npx ng build --configuration production

# ---- Production stage ----
FROM nginx:alpine AS production

# Copy the built Angular dist into nginx's web root
COPY --from=build-step /app/dist/UltimateCharadesFrontend /usr/share/nginx/html

# Configure nginx for SPA routing
RUN printf 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
