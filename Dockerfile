# Etapa 1: Construcción de la app Vue con Node 16
FROM node:16 AS build-stage
WORKDIR /app
COPY . .

# Opcional pero seguro
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install
RUN npm run build

# Etapa 2: Servir con NGINX
FROM nginx:alpine
COPY --from=build-stage /app/public/client /usr/share/nginx/html
COPY nginx.template.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
