# Exercício 5 - Acesso Seguro ao PostgreSQL

## Objetivo
Criar uma imagem Docker que acesse um banco PostgreSQL de forma segura, usando variáveis de ambiente e sem expor credenciais no build.

## Características
- Imagem base: Alpine Linux
- Cliente PostgreSQL instalado
- Script bash para verificação de conexão
- Credenciais via variáveis de ambiente
- `.dockerignore` para evitar exposição de arquivos sensíveis
- Validação completa de conexão e permissões

## Estrutura de Arquivos
```
ex5-postgres-seguro/
├── Dockerfile
├── check.sh
├── .dockerignore
├── .env.example
└── README.md
```

## Segurança

### ✅ Boas Práticas Implementadas
- Credenciais **nunca** hardcoded no código
- Uso de variáveis de ambiente
- `.dockerignore` bloqueia arquivos `.env` e certificados
- Senha limpa da memória após uso
- Script falha imediatamente se variáveis não estão definidas

### ❌ O que NÃO fazer
- ❌ `ENV DB_PASS=senha123` no Dockerfile
- ❌ Commitar arquivo `.env` no git
- ❌ Passar senhas via argumentos `ARG`
- ❌ Logs com senhas em texto claro

## Como Executar

### Pré-requisitos
Tenha um PostgreSQL rodando. Pode usar Docker:

```powershell
docker run -d `
  --name postgres-test `
  -e POSTGRES_USER=admin `
  -e POSTGRES_PASSWORD=senha123 `
  -e POSTGRES_DB=biblioteca `
  -p 5432:5432 `
  postgres:15-alpine
```

### 1. Construir a imagem
```powershell
cd exercicios-docker\ex5-postgres-seguro
docker build -t cofre:1 .
```

**Importante**: Observe que `.env` não é copiado para a imagem!

### 2. Executar com variáveis de ambiente
```powershell
docker run --rm `
  -e DB_HOST=host.docker.internal `
  -e DB_USER=admin `
  -e DB_PASS=senha123 `
  -e DB_NAME=biblioteca `
  cofre:1
```

**Nota**: `host.docker.internal` permite acessar localhost do host Windows/Mac.

### 3. Usar arquivo .env (apenas para desenvolvimento local)
```powershell
# Criar arquivo .env (copiar de .env.example)
docker run --rm --env-file .env cofre:1
```

### 4. Testar falha de conexão
```powershell
# Senha errada
docker run --rm `
  -e DB_HOST=host.docker.internal `
  -e DB_USER=admin `
  -e DB_PASS=senhaerrada `
  -e DB_NAME=biblioteca `
  cofre:1
```

### 5. Verificar que credenciais não estão na imagem
```powershell
# Inspecionar a imagem
docker history cofre:1

# Procurar por senhas (não deve encontrar)
docker run --rm cofre:1 cat /app/check.sh | Select-String -Pattern "senha"
```

## O que o Script Faz

1. ✅ Valida variáveis obrigatórias
2. 🔐 Define senha via `PGPASSWORD` (seguro)
3. 📡 Tenta conectar ao PostgreSQL
4. 📊 Exibe informações do banco
5. 🧪 Testa permissões de escrita
6. 🧹 Limpa senha da memória
7. ✨ Retorna código de saída apropriado

## Exemplo de Saída Bem-Sucedida

```
🔐 Iniciando verificação de conexão ao PostgreSQL...
================================
📡 Configurações:
  Host: host.docker.internal
  Port: 5432
  User: admin
  Database: biblioteca
  Password: ********
================================
🔄 Tentando conectar ao banco de dados...
✅ Conexão estabelecida com sucesso!

📊 Informações do banco:
 database  | user  |           version            |         timestamp
-----------+-------+------------------------------+---------------------------
 biblioteca| admin | PostgreSQL 15.4 on x86_64... | 2024-11-03 10:30:45.123

🧪 Testando permissões de escrita...
✅ Permissões de escrita OK

================================
🎉 Verificação concluída com sucesso!
```

## Uso em Produção

### Com Docker Secrets (Swarm)
```yaml
services:
  checker:
    image: cofre:1
    secrets:
      - db_password
    environment:
      DB_HOST: postgres-prod
      DB_USER: app_user
      DB_PASS_FILE: /run/secrets/db_password
```

### Com Kubernetes Secrets
```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: checker
    image: cofre:1
    env:
    - name: DB_PASS
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
```

## Limpeza
```powershell
# Parar e remover PostgreSQL de teste
docker stop postgres-test
docker rm postgres-test

# Remover imagem
docker rmi cofre:1
```

## Conceitos de Segurança

### Layers e Cache
O Docker armazena layers em cache. Se você usar `ENV DB_PASS=senha`, mesmo que apague depois, a senha ficará em uma layer anterior!

### Runtime vs Build Time
- **Build**: Use apenas configurações não-sensíveis
- **Runtime**: Injete credenciais via `-e` ou secrets

### .dockerignore
Essencial para:
- Evitar copiar `.env` acidentalmente
- Excluir certificados e chaves
- Manter imagem limpa e segura
