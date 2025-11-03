# 🐳 Exercícios de Docker e Docker Compose

Coleção completa de 8 exercícios práticos para aprender Docker e Docker Compose, desde conceitos básicos até técnicas avançadas de segurança e CI/CD.

## 📋 Índice de Exercícios

1. [**Imagem Alpine com Saudação**](#exercício-1---imagem-alpine-com-saudação) - Básico
2. [**Aplicação Node.js**](#exercício-2---aplicação-nodejs) - Intermediário
3. [**Multi-stage Build Java**](#exercício-3---multi-stage-build-java) - Intermediário
4. [**Docker Compose com Healthcheck**](#exercício-4---docker-compose-com-healthcheck) - Intermediário
5. [**Acesso Seguro ao PostgreSQL**](#exercício-5---acesso-seguro-ao-postgresql) - Avançado
6. [**Frontend com Hot-Reload**](#exercício-6---frontend-com-hot-reload) - Intermediário
7. [**Pipeline CI Local**](#exercício-7---pipeline-ci-local) - Avançado
8. [**Variáveis e Configs Seguros**](#exercício-8---variáveis-e-configs-seguros) - Avançado

---

## Exercício 1 - Imagem Alpine com Saudação

**Nível:** 🟢 Básico  
**Tempo:** 10 minutos  
**Conceitos:** Dockerfile, imagem base, comandos básicos

### O que você vai aprender
- Criar um Dockerfile do zero
- Usar Alpine Linux (imagem leve)
- Instalar pacotes com `apk`
- Configurar mensagem de boas-vindas

### Como executar
```powershell
cd exercicios-docker\ex1-alpine-saudacao
docker build -t cafe:1 .
docker run -it cafe:1
```

### Resultado esperado
Exibe "Bom dia! Café quente e build verde." e abre terminal bash interativo.

📖 [Ver documentação completa](./ex1-alpine-saudacao/README.md)

---

## Exercício 2 - Aplicação Node.js

**Nível:** 🟡 Intermediário  
**Tempo:** 15 minutos  
**Conceitos:** Cache de layers, .dockerignore, aplicação web

### O que você vai aprender
- Otimizar build com cache de dependências
- Usar `.dockerignore` efetivamente
- Criar aplicação Express.js
- Expor portas e rodar em background

### Como executar
```powershell
cd exercicios-docker\ex2-nodejs-app
docker build -t biblioteca:1 .
docker run -d -p 3000:3000 biblioteca:1
```

Acesse: http://localhost:3000

📖 [Ver documentação completa](./ex2-nodejs-app/README.md)

---

## Exercício 3 - Multi-stage Build Java

**Nível:** 🟡 Intermediário  
**Tempo:** 20 minutos  
**Conceitos:** Multi-stage build, otimização de tamanho, Maven

### O que você vai aprender
- Criar build em múltiplos estágios
- Separar build de runtime
- Reduzir tamanho de imagem em ~70%
- Usar Spring Boot com Docker

### Como executar
```powershell
cd exercicios-docker\ex3-java-multistage
docker build -t java-app:1 .
docker run -d -p 8080:8080 java-app:1
```

Acesse: http://localhost:8080

**Dica:** Compare o tamanho da imagem com uma versão sem multi-stage!

📖 [Ver documentação completa](./ex3-java-multistage/README.md)

---

## Exercício 4 - Docker Compose com Healthcheck

**Nível:** 🟡 Intermediário  
**Tempo:** 20 minutos  
**Conceitos:** Docker Compose, healthcheck, depends_on, PostgreSQL

### O que você vai aprender
- Orquestrar múltiplos containers
- Configurar healthcheck em banco de dados
- Usar `depends_on` com condições
- Persistir dados com volumes

### Como executar
```powershell
cd exercicios-docker\ex4-compose-healthcheck
docker compose up --build
```

Acesse: http://localhost:3000

**Features:**
- App aguarda PostgreSQL estar pronto
- CRUD completo de livros
- Persistência de dados
- Health checks automáticos

📖 [Ver documentação completa](./ex4-compose-healthcheck/README.md)

---

## Exercício 5 - Acesso Seguro ao PostgreSQL

**Nível:** 🔴 Avançado  
**Tempo:** 25 minutos  
**Conceitos:** Segurança, variáveis de ambiente, .dockerignore, secrets

### O que você vai aprender
- Gerenciar credenciais com segurança
- Usar variáveis de ambiente corretamente
- Evitar exposição de senhas no build
- Criar scripts bash robustos

### Como executar

**1. Iniciar PostgreSQL de teste:**
```powershell
docker run -d --name postgres-test `
  -e POSTGRES_USER=admin `
  -e POSTGRES_PASSWORD=senha123 `
  -e POSTGRES_DB=biblioteca `
  -p 5432:5432 `
  postgres:15-alpine
```

**2. Executar verificação:**
```powershell
cd exercicios-docker\ex5-postgres-seguro
docker build -t cofre:1 .
docker run --rm `
  -e DB_HOST=host.docker.internal `
  -e DB_USER=admin `
  -e DB_PASS=senha123 `
  -e DB_NAME=biblioteca `
  cofre:1
```

**Importante:** ⚠️ Nunca use valores reais em produção!

📖 [Ver documentação completa](./ex5-postgres-seguro/README.md)

---

## Exercício 6 - Frontend com Hot-Reload

**Nível:** 🟡 Intermediário  
**Tempo:** 20 minutos  
**Conceitos:** Volume mounting, hot-reload, Vite, desenvolvimento

### O que você vai aprender
- Configurar ambiente de desenvolvimento
- Habilitar hot-reload com Docker
- Montar volumes de código
- Usar Vite em containers

### Como executar
```powershell
cd exercicios-docker\ex6-frontend-dev
docker compose up
```

Acesse: http://localhost:5173

**Teste o hot-reload:**
1. Deixe o navegador aberto
2. Edite `main.js`
3. Salve o arquivo
4. Veja a mágica acontecer! ✨

📖 [Ver documentação completa](./ex6-frontend-dev/README.md)

---

## Exercício 7 - Pipeline CI Local

**Nível:** 🔴 Avançado  
**Tempo:** 30 minutos  
**Conceitos:** Docker-in-Docker, CI/CD, registry local, testes automatizados

### O que você vai aprender
- Simular pipeline de CI completo
- Usar Docker-in-Docker (DinD)
- Configurar registry local
- Executar testes automatizados
- Publicar imagens

### Como executar
```powershell
cd exercicios-docker\ex7-pipeline-ci
docker compose up --build
```

**O pipeline faz:**
1. 🔨 Build da aplicação
2. 📦 Push para registry local
3. 🧪 Testes automatizados com pytest
4. ✅ Relatório de cobertura

**Verificar imagens:**
```powershell
curl http://localhost:5000/v2/_catalog
```

📖 [Ver documentação completa](./ex7-pipeline-ci/README.md)

---

## Exercício 8 - Variáveis e Configs Seguros

**Nível:** 🔴 Avançado  
**Tempo:** 25 minutos  
**Conceitos:** env_file, configs, segurança, mascaramento de dados

### O que você vai aprender
- Diferenciar env_file de configs
- Montar configurações read-only
- Mascarar dados sensíveis em logs
- Implementar boas práticas de segurança

### Como executar
```powershell
cd exercicios-docker\ex8-variaveis-seguras
docker compose up --build
```

Acesse: http://localhost:4000

**Endpoints:**
- `/` - Página inicial
- `/info` - Informações (dados mascarados)
- `/health` - Status da aplicação
- `/config` - Configurações do YAML

📖 [Ver documentação completa](./ex8-variaveis-seguras/README.md)

---

## 📚 Conceitos por Exercício

| Exercício | Conceitos Principais |
|-----------|---------------------|
| 1 | Dockerfile básico, Alpine, instalação de pacotes |
| 2 | Cache de layers, .dockerignore, aplicações web |
| 3 | Multi-stage build, otimização, Java/Maven |
| 4 | Compose, healthcheck, volumes, networks |
| 5 | Segurança, variáveis de ambiente, scripts bash |
| 6 | Hot-reload, volume mounting, Vite |
| 7 | CI/CD, DinD, registry, testes automatizados |
| 8 | env_file vs configs, segurança, mascaramento |

---

## 🎓 Ordem Sugerida de Estudo

### Para Iniciantes
1. Exercício 1 (Alpine básico)
2. Exercício 2 (Node.js)
3. Exercício 4 (Compose básico)
4. Exercício 6 (Hot-reload)

### Para Nível Intermediário
1. Exercício 3 (Multi-stage)
2. Exercício 4 (Healthcheck)
3. Exercício 6 (Frontend)
4. Exercício 8 (Configs)

### Para Nível Avançado
1. Exercício 5 (Segurança)
2. Exercício 7 (CI/CD)
3. Exercício 8 (Configs avançados)

---

## 🛠️ Pré-requisitos

### Ferramentas Necessárias
- **Docker Desktop** 20.10+
- **Docker Compose** 2.0+
- **PowerShell** (Windows)
- **Git** (para clonar)

### Verificar Instalação
```powershell
docker --version
docker compose version
```

---

## 📖 Comandos Úteis

### Docker Básico
```powershell
# Listar imagens
docker images

# Listar containers
docker ps -a

# Remover container
docker rm <container-name>

# Remover imagem
docker rmi <image-name>

# Ver logs
docker logs <container-name>

# Executar comando no container
docker exec -it <container-name> sh
```

### Docker Compose
```powershell
# Iniciar serviços
docker compose up

# Iniciar em background
docker compose up -d

# Parar serviços
docker compose down

# Ver logs
docker compose logs -f

# Rebuild forçado
docker compose up --build --force-recreate
```

### Limpeza
```powershell
# Remover containers parados
docker container prune

# Remover imagens não usadas
docker image prune -a

# Remover volumes não usados
docker volume prune

# Limpar tudo (cuidado!)
docker system prune -a --volumes
```

---

## 🐛 Troubleshooting Comum

### Porta já em uso
```powershell
# Windows: encontrar processo na porta
netstat -ano | findstr :3000

# Matar processo
taskkill /PID <pid> /F
```

### Container não inicia
```powershell
# Ver logs completos
docker logs <container-name>

# Entrar no container (se estiver rodando)
docker exec -it <container-name> sh
```

### Build muito lento
```powershell
# Limpar cache de build
docker builder prune

# Build sem cache
docker build --no-cache -t <name> .
```

### Problemas de rede
```powershell
# Listar networks
docker network ls

# Inspecionar network
docker network inspect <network-name>

# Recriar network
docker compose down
docker compose up
```

---

## 📊 Estatísticas dos Exercícios

| # | Nome | Dificuldade | Tempo | Arquivos | Conceitos |
|---|------|------------|-------|----------|-----------|
| 1 | Alpine Saudação | ⭐ | 10min | 2 | 3 |
| 2 | Node.js App | ⭐⭐ | 15min | 5 | 5 |
| 3 | Java Multi-stage | ⭐⭐ | 20min | 4 | 6 |
| 4 | Compose Healthcheck | ⭐⭐ | 20min | 5 | 7 |
| 5 | PostgreSQL Seguro | ⭐⭐⭐ | 25min | 5 | 8 |
| 6 | Frontend Hot-reload | ⭐⭐ | 20min | 6 | 6 |
| 7 | Pipeline CI | ⭐⭐⭐ | 30min | 6 | 9 |
| 8 | Configs Seguros | ⭐⭐⭐ | 25min | 6 | 8 |

**Total:** ~2h45min de prática hands-on

---

## 🎯 Objetivos de Aprendizado

Após completar todos os exercícios, você será capaz de:

✅ Criar Dockerfiles otimizados  
✅ Usar multi-stage builds efetivamente  
✅ Orquestrar múltiplos containers com Compose  
✅ Implementar healthchecks e depends_on  
✅ Gerenciar variáveis de ambiente com segurança  
✅ Configurar ambientes de desenvolvimento com hot-reload  
✅ Simular pipelines de CI/CD localmente  
✅ Aplicar boas práticas de segurança Docker  

---

## 🚀 Próximos Passos

Depois de dominar estes exercícios:

1. **Kubernetes**: Migrar para orquestração em escala
2. **Docker Swarm**: Clusters Docker nativos
3. **Harbor**: Registry privado empresarial
4. **Trivy**: Scan de segurança de imagens
5. **GitHub Actions**: CI/CD em produção
6. **ArgoCD**: GitOps e deploy contínuo

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Cursos e Tutoriais
- [Docker Get Started](https://docs.docker.com/get-started/)
- [Play with Docker](https://labs.play-with-docker.com/)
- [Docker Hub](https://hub.docker.com/)

### Ferramentas Úteis
- [Dive](https://github.com/wagoodman/dive) - Análise de layers
- [Hadolint](https://github.com/hadolint/hadolint) - Linter de Dockerfile
- [Docker Slim](https://github.com/docker-slim/docker-slim) - Otimização de imagens

---

## 🤝 Contribuindo

Encontrou um erro ou tem sugestões? Abra uma issue ou pull request!

---

## 📝 Licença

Estes exercícios são de uso educacional livre.

---

## ✨ Bônus: Cheat Sheet

```powershell
# Build otimizado
docker build -t app:latest .

# Run com todas as opções
docker run -d \
  --name myapp \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -v $(pwd):/app \
  --restart unless-stopped \
  app:latest

# Compose completo
docker compose up -d --build --force-recreate

# Debug de container
docker exec -it myapp sh
docker logs -f myapp
docker inspect myapp

# Limpeza total
docker system prune -a --volumes -f

# Exportar/Importar imagem
docker save app:latest | gzip > app.tar.gz
gunzip -c app.tar.gz | docker load
```

---

**Bons estudos e divirta-se aprendendo Docker! 🐳✨**
