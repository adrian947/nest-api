# Usa una imagen base de Node.js
FROM node:18.16.0

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu aplicación al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY src/ ./src


# Comando para ejecutar tu aplicación
CMD npm run start:dev
