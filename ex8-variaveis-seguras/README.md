# Exercício 8 - Variáveis e Configurações Seguras

## Objetivo
Implementar gestão segura de variáveis de ambiente e configurações usando Docker Compose, separando dados sensíveis de configurações estáticas.

## Características
- **env_file**: Carrega variáveis de ambiente de `.env`
- **configs**: Monta arquivo de configuração YAML como read-only
- Mascaramento de dados sensíveis em logs
- Endpoint `/info` que expõe configurações de forma segura
- Demonstração de boas práticas de segurança

## Estrutura de Arquivos
```
ex8-variaveis-seguras/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── server.js
├── .env (sensível - não commitar!)
├── config.yml
└── README.md
```

## Diferença: env_file vs configs

### env_file (.env)
- **Uso**: Dados sensíveis e variáveis de ambiente
- **Exemplos**: Senhas, tokens, API keys, connection strings
- **Características**:
  - Injetado como variáveis de ambiente
  - Fácil de mudar sem rebuild
  - Pode ser diferente por ambiente (dev/prod)
  - ⚠️ Nunca commitar no git!

### configs (config.yml)
- **Uso**: Configurações estáticas da aplicação
- **Exemplos**: Features, timeouts, limites, níveis de log
- **Características**:
  - Montado como arquivo read-only
  - Versionado no git
  - Compartilhado entre ambientes
  - Não contém segredos

## Como Executar

### 1. Verificar o arquivo .env
O arquivo `.env` já está criado com valores de exemplo:

```env
NODE_ENV=development
API_KEY=sk_test_1234567890abcdefghijklmnop
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=meu_super_secret_jwt_token_12345
```

### 2. Iniciar a aplicação
```powershell
cd exercicios-docker\ex8-variaveis-seguras
docker compose up --build
```

### 3. Acessar a aplicação
Abra o navegador em: http://localhost:4000

### 4. Explorar os endpoints

**Página inicial:**
http://localhost:4000/

**Informações completas:**
http://localhost:4000/info

Observe como dados sensíveis são mascarados:
- API Key: `***mnop` (últimos 4 caracteres)
- Email: `e******o@gmail.com`
- JWT Secret: `configured` (não exposto)

**Health check:**
http://localhost:4000/health

**Configurações do YAML:**
http://localhost:4000/config

### 5. Verificar logs
```powershell
docker compose logs api
```

Observe que senhas e tokens são mascarados com `********`

### 6. Testar read-only do config
Tente modificar o arquivo dentro do container:

```powershell
docker exec api-secure sh -c "echo 'test' >> /etc/app/config.yml"
```

Resultado: **Erro!** Arquivo é somente leitura.

### 7. Parar o serviço
```powershell
docker compose down
```

## Configuração do Compose

### env_file
```yaml
services:
  api:
    env_file:
      - .env  # Carrega variáveis do arquivo
```

Equivalente a passar várias flags `-e`:
```powershell
docker run -e API_KEY=... -e DATABASE_URL=... api
```

### configs
```yaml
configs:
  app_config:
    file: ./config.yml

services:
  api:
    configs:
      - source: app_config
        target: /etc/app/config.yml
        mode: 0444  # Read-only (r--r--r--)
```

## Boas Práticas Implementadas

### ✅ Segurança
- Variáveis sensíveis em `.env` (não commitado)
- Logs mascaram senhas e tokens
- Config montado como read-only
- API não expõe credenciais completas

### ✅ Organização
- Separação clara: env vs config
- Nomes descritivos de variáveis
- Comentários explicativos

### ✅ Manutenibilidade
- Fácil mudar variáveis sem rebuild
- Configs versionadas no git
- Documentação inline

## Teste de Segurança

### Ver variáveis dentro do container
```powershell
docker exec api-secure env
```

Você verá as variáveis, mas no código elas são tratadas com cuidado.

### Inspecionar config montado
```powershell
docker exec api-secure cat /etc/app/config.yml
```

### Verificar permissões
```powershell
docker exec api-secure ls -la /etc/app/config.yml
```

Resultado: `-r--r--r--` (somente leitura)

## Ambiente de Produção

### Docker Swarm Secrets
```yaml
services:
  api:
    secrets:
      - db_password
      - api_key
    environment:
      DATABASE_PASSWORD_FILE: /run/secrets/db_password
      API_KEY_FILE: /run/secrets/api_key

secrets:
  db_password:
    external: true
  api_key:
    external: true
```

Criar secrets:
```powershell
echo "senha123" | docker secret create db_password -
echo "key123" | docker secret create api_key -
```

### Kubernetes ConfigMap e Secrets
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  config.yml: |
    app:
      name: "API Produção"
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  API_KEY: "sk_prod_..."
  JWT_SECRET: "prod_secret_..."
```

### HashiCorp Vault
```javascript
const vault = require('node-vault')();
const apiKey = await vault.read('secret/data/api-key');
```

## Exemplo: Múltiplos Ambientes

### .env.development
```env
NODE_ENV=development
API_KEY=sk_test_123
DATABASE_URL=postgresql://localhost:5432/dev_db
```

### .env.production
```env
NODE_ENV=production
API_KEY=sk_live_xyz
DATABASE_URL=postgresql://prod-server:5432/prod_db
```

### docker-compose.prod.yml
```yaml
services:
  api:
    env_file:
      - .env.production
```

Executar:
```powershell
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## Checklist de Segurança

Antes de ir para produção:

- [ ] `.env` está em `.gitignore`
- [ ] Valores de exemplo em `.env.example` (sem segredos reais)
- [ ] Logs não expõem senhas completas
- [ ] API não retorna credenciais em endpoints
- [ ] Configs sensíveis usam Docker Secrets ou Vault
- [ ] Permissions de arquivos estão corretas (read-only)
- [ ] Variáveis são validadas ao iniciar
- [ ] Existe fallback para variáveis ausentes

## Troubleshooting

### Variáveis não carregam?
1. Verificar formato do .env (sem espaços extras)
2. Confirmar que env_file aponta para arquivo correto
3. Rebuild: `docker compose up --build --force-recreate`

### Config.yml não encontrado?
1. Verificar caminho em `configs.file`
2. Confirmar que arquivo existe localmente
3. Ver logs: `docker compose logs api`

### Permissões negadas?
1. Verificar `mode: 0444` no config
2. Não tentar modificar arquivo read-only
3. Se precisar escrever, use volume comum (não config)

## Expansões

### Validação de Variáveis
```javascript
const requiredEnvs = ['API_KEY', 'DATABASE_URL', 'JWT_SECRET'];
requiredEnvs.forEach(env => {
  if (!process.env[env]) {
    console.error(`❌ Variável ${env} não definida!`);
    process.exit(1);
  }
});
```

### Reload de Config
```javascript
const chokidar = require('chokidar');
chokidar.watch('/etc/app/config.yml').on('change', () => {
  console.log('🔄 Config atualizado, recarregando...');
  config = yaml.load(fs.readFileSync('/etc/app/config.yml'));
});
```

### Audit Log
```javascript
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

## Recursos Adicionais

- [Docker Secrets](https://docs.docker.com/engine/swarm/secrets/)
- [Docker Configs](https://docs.docker.com/engine/swarm/configs/)
- [12 Factor App - Config](https://12factor.net/config)
- [OWASP Secure Configuration](https://owasp.org/www-project-secure-headers/)
