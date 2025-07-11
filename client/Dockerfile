# Etapa 1: Build del frontend
FROM node:16 as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Nginx para servir frontend
FROM nginx:alpine

# Argumento de backend dinámico
ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL}

# Copiar build generado
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar plantilla nginx y reemplazar la variable
COPY nginx.template.conf /etc/nginx/templates/nginx.conf.template
RUN envsubst '${API_BASE_URL}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
