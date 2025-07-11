# Etapa 1: Build del frontend
FROM node:lts AS build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: NGINX para servir
FROM nginx:stable-alpine AS production-stage

# Copiar el build generado
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar la plantilla NGINX
COPY nginx.template.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
