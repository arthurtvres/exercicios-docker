# Exercício 2: Aplicação Node.js
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar apenas arquivos de dependências primeiro (cache layer)
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci --only=production

# Copiar o restante do projeto
COPY . .

# Expor a porta da aplicação
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "index.js"]
