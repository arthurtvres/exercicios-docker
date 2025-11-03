FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (incluindo dev)
RUN npm install

# Copiar o resto do código
COPY . .

# Expor porta do Vite
EXPOSE 5173

# Comando padrão (pode ser sobrescrito no compose)
CMD ["npm", "run", "dev"]
