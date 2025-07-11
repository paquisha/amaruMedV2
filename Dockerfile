# Etapa 1: Build del frontend
FROM node:16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Imagen NGINX final
FROM nginx:alpine

# Argumento que viene desde GitHub Actions
ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL}

# Copiar build generado
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar plantilla nginx
COPY nginx.template.conf /etc/nginx/templates/nginx.conf.template

# Reemplazo en tiempo de build
RUN apk add --no-cache gettext && \
    envsubst '${API_BASE_URL}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
