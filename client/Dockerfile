# Etapa 1: Build
FROM node:16.20.2 AS build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir archivos estáticos con nginx
FROM nginx:alpine AS production-stage

# Copiar build de Vue al directorio público de nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Eliminar la configuración por defecto y usar nuestra propia (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
