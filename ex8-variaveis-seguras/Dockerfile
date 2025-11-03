FROM node:20-alpine

WORKDIR /usr/src/app

# Instalar dependências do sistema
RUN apk add --no-cache tini

# Copiar package files
COPY package*.json ./
RUN npm ci --only=production

# Copiar código
COPY . .

EXPOSE 4000

# Usar tini para gerenciar processos
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "server.js"]
