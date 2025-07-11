FROM node:16.20

# Crear carpeta de trabajo
WORKDIR /app

# Copiar archivos de dependencias y compilación
COPY package.json yarn.lock ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN yarn install

# Verificar estructura antes de copiar código
RUN echo "=== Antes de COPY . . ===" && ls -l /app

# Copiar el resto del código fuente
COPY . .

# Verificar que el código fuente está presente
RUN echo "=== Después de COPY . . ===" && ls -l /app && ls -l /app/src

# Ejecutar build y mostrar resultado
RUN echo "=== Ejecutando build ===" && yarn build && echo "=== Archivos en dist/ ===" && ls -l dist

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "-r", "source-map-support/register", "dist/index.js"]
