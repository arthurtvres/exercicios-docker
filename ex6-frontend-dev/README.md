# Exercício 6 - Frontend Development com Hot-Reload

## Objetivo
Configurar um ambiente de desenvolvimento front-end com Docker Compose que suporte hot-reload, permitindo ver mudanças no código instantaneamente.

## Características
- Vite como servidor de desenvolvimento
- Hot-reload ativado via volume mount
- Porta 5173 exposta
- Configuração otimizada para Docker
- Interface interativa com contador

## Estrutura de Arquivos
```
ex6-frontend-dev/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── README.md
```

## Como Executar

### 1. Iniciar o ambiente
```powershell
cd exercicios-docker\ex6-frontend-dev
docker compose up
```

**Aguarde**: A primeira vez pode demorar (instalação de dependências).

### 2. Acessar a aplicação
Abra o navegador em: http://localhost:5173

Você verá uma página interativa com contador e relógio.

### 3. Testar Hot-Reload

Deixe o navegador aberto e edite o arquivo `main.js`. Por exemplo, mude a linha:

```javascript
<h1>🚀 Frontend Development</h1>
```

Para:

```javascript
<h1>🎨 Meu Frontend Incrível</h1>
```

**Salve o arquivo** e observe o navegador atualizar automaticamente! 🎉

### 4. Outras mudanças para testar

**Mudar as cores (em `main.js`):**
```javascript
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Adicionar novo botão:**
```javascript
<button id="double">✖️ Dobrar</button>
```

E adicionar o listener:
```javascript
document.getElementById('double').addEventListener('click', () => {
  count *= 2;
  render();
});
```

### 5. Ver logs
```powershell
docker compose logs -f web
```

### 6. Parar o ambiente
```powershell
docker compose down
```

## Conceitos Importantes

### Volume Mounting
```yaml
volumes:
  - .:/usr/src/app
  - /usr/src/app/node_modules
```

- **Primeira linha**: Monta o diretório atual no container
- **Segunda linha**: Preserva `node_modules` do container (não sobrescreve)

### Por que funciona?

1. **Polling**: `usePolling: true` no Vite detecta mudanças em sistemas de arquivo Docker
2. **Host 0.0.0.0**: Permite acesso de fora do container
3. **Volume mount**: Código host é sincronizado com container

### Vantagens

✅ **Desenvolvimento rápido**: Mudanças instantâneas  
✅ **Ambiente isolado**: Não precisa instalar Node.js local  
✅ **Consistência**: Mesmo ambiente para toda equipe  
✅ **Fácil onboarding**: `docker compose up` e pronto!

## Configuração do Vite

O arquivo `vite.config.js` contém:

```javascript
server: {
  host: '0.0.0.0',      // Escuta em todas interfaces
  port: 5173,           // Porta padrão Vite
  watch: {
    usePolling: true,   // Necessário para Docker
  }
}
```

### usePolling
Docker usa um sistema de arquivo virtualizado. O `usePolling` força o Vite a verificar mudanças ativamente ao invés de esperar notificações do sistema.

## Build para Produção

### 1. Adicionar stage de produção no Dockerfile
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Usar docker-compose.prod.yml
```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
```

## Troubleshooting

### Hot-reload não funciona?
1. Verificar se `usePolling: true` está no `vite.config.js`
2. Certificar que volumes estão montados corretamente
3. Reiniciar: `docker compose restart`

### Porta 5173 já está em uso?
Mude no `docker-compose.yml`:
```yaml
ports:
  - "3000:5173"  # Acesse via localhost:3000
```

### Mudanças não aparecem?
1. Verificar se salvou o arquivo
2. Ver logs: `docker compose logs -f`
3. Fazer hard refresh: `Ctrl+Shift+R` no navegador

## Expansões Possíveis

- Adicionar React, Vue ou Svelte
- Integrar TypeScript
- Adicionar ESLint e Prettier
- Configurar proxy para API backend
- Adicionar testes com Vitest
