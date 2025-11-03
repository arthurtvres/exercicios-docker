# Exercício 4 - Docker Compose com Healthcheck

## Objetivo
Criar um ambiente com Docker Compose que utilize healthcheck para garantir que o banco de dados esteja pronto antes de iniciar a aplicação.

## Características
- **Serviço DB**: PostgreSQL 15 Alpine
  - Healthcheck usando `pg_isready`
  - Volume persistente para dados
- **Serviço App**: Node.js com Express
  - Depende do DB com `condition: service_healthy`
  - Aguarda banco estar saudável antes de iniciar
- Rede isolada entre serviços
- Aplicação completa com CRUD de livros

## Estrutura de Arquivos
```
ex4-compose-healthcheck/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── index.js
└── README.md
```

## Como Executar

### 1. Iniciar os serviços
```powershell
cd exercicios-docker\ex4-compose-healthcheck
docker compose up --build
```

**Observe**: O app só iniciará após o PostgreSQL passar no healthcheck!

### 2. Acompanhar os logs
Em outro terminal:
```powershell
docker compose logs -f
```

### 3. Verificar status dos serviços
```powershell
docker compose ps
```

### 4. Testar a aplicação
Abra o navegador em: http://localhost:3000

Endpoints disponíveis:
- `/` - Página inicial
- `/health` - Status da aplicação e banco
- `/db-status` - Informações do PostgreSQL
- `/setup` - Criar tabela e dados de exemplo
- `/livros` - Listar livros

### 5. Executar setup inicial
Acesse: http://localhost:3000/setup

Isso criará a tabela e inserirá livros de exemplo.

### 6. Testar persistência
```powershell
# Parar os serviços
docker compose down

# Reiniciar
docker compose up -d

# Verificar que os dados persistiram
# Acesse: http://localhost:3000/livros
```

### 7. Limpar tudo (incluindo volumes)
```powershell
docker compose down -v
```

## Conceitos Importantes

### Healthcheck no PostgreSQL
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U admin -d biblioteca"]
  interval: 5s
  timeout: 3s
  retries: 5
  start_period: 10s
```

- **test**: Comando para verificar saúde
- **interval**: Frequência das verificações
- **timeout**: Tempo máximo de espera
- **retries**: Tentativas antes de marcar como unhealthy
- **start_period**: Tempo de graça no início

### Depends On com Condition
```yaml
depends_on:
  db:
    condition: service_healthy
```

Garante que:
1. O serviço DB é iniciado primeiro
2. O App só inicia após DB passar no healthcheck
3. Evita erros de conexão no startup

## Testando o Healthcheck

### Ver status de saúde
```powershell
docker inspect postgres-db --format='{{.State.Health.Status}}'
```

### Simular falha do banco
```powershell
# Parar o PostgreSQL
docker compose stop db

# App ficará sem conexão
# Acesse: http://localhost:3000/health

# Reiniciar o banco
docker compose start db
```

## Vantagens

✅ **Inicialização ordenada**: App não tenta conectar antes do DB estar pronto  
✅ **Resiliência**: Healthcheck contínuo detecta problemas  
✅ **Persistência**: Volume mantém dados entre restarts  
✅ **Isolamento**: Network dedicada entre serviços
