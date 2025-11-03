FROM node:20-alpine

WORKDIR /usr/src/app

# Instalar cliente PostgreSQL para testes de conexão
RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
