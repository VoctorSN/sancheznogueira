# Build stage
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar solo las dependencias de producción
COPY package*.json ./

RUN npm install --only=production

# Copiar la aplicación
COPY --from=builder /app .

EXPOSE 5000

CMD ["node", "./server/server.js"]
