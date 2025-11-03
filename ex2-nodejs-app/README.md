# Exercício 2 - Aplicação Node.js com Docker

## Objetivo
Criar uma imagem Docker para uma aplicação Node.js simples seguindo as melhores práticas.

## Características
- Imagem base: `node:20-alpine`
- Cache otimizado de dependências
- `.dockerignore` para excluir arquivos desnecessários
- Aplicação Express.js simples
- Porta 3000 exposta

## Estrutura de Arquivos
```
ex2-nodejs-app/
├── Dockerfile
├── .dockerignore
├── package.json
├── index.js
└── README.md
```

## Como Executar

### 1. Construir a imagem
```powershell
cd exercicios-docker\ex2-nodejs-app
docker build -t biblioteca:1 .
```

### 2. Executar o contêiner
```powershell
docker run -d -p 3000:3000 --name biblioteca-container biblioteca:1
```

### 3. Testar a aplicação
Abra o navegador em: http://localhost:3000

Você verá uma página de boas-vindas da aplicação.

### 4. Verificar logs
```powershell
docker logs biblioteca-container
```

### 5. Parar e remover o contêiner
```powershell
docker stop biblioteca-container
docker rm biblioteca-container
```

## Conceitos Importantes

### Multi-stage Build Implícito
O Dockerfile copia primeiro os `package*.json` e executa `npm ci` antes de copiar o código. Isso aproveita o cache do Docker:
- Se as dependências não mudarem, o `npm ci` não é executado novamente
- Apenas mudanças no código causam rebuild da última camada

### .dockerignore
Similar ao `.gitignore`, evita copiar arquivos desnecessários:
- `node_modules` - será instalado via npm ci
- `.git` - histórico git não é necessário na imagem
- Arquivos de log - mantém a imagem limpa
