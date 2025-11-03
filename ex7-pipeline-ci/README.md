# Exercício 7 - Pipeline CI Local com Docker Compose

## Objetivo
Simular um pipeline de Integração Contínua (CI) completo usando Docker Compose, incluindo build, testes e publicação de imagens.

## Características
- **Docker-in-Docker (DinD)**: Permite builds dentro do container
- **Registry Local**: Armazena imagens construídas
- **Builder**: Constrói a aplicação
- **Tester**: Executa testes automatizados
- Pipeline completo em ambiente isolado

## Estrutura de Arquivos
```
ex7-pipeline-ci/
├── docker-compose.yml
├── app/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app.py
│   └── tests/
│       └── test_app.py
└── README.md
```

## Componentes do Pipeline

### 1. Registry (registry:2)
Registro Docker local para armazenar imagens construídas.
- Porta: 5000
- Persistência via volume

### 2. Docker-in-Docker (docker:dind)
Daemon Docker rodando dentro de container.
- Permite builds sem afetar Docker do host
- Modo privilegiado necessário

### 3. Builder
Constrói a imagem da aplicação e publica no registry.
- Usa Docker CLI
- Conecta ao daemon DinD
- Push automático para registry

### 4. App (Tester)
Executa testes pytest com cobertura.
- Instala dependências de teste
- Roda suíte completa
- Gera relatório de cobertura

## Como Executar

### 1. Executar o pipeline completo
```powershell
cd exercicios-docker\ex7-pipeline-ci
docker compose up --build
```

**Observe a sequência:**
1. 🏁 Registry e Docker iniciam
2. 🔨 Builder constrói a imagem
3. 📦 Imagem é enviada para registry
4. 🧪 Testes são executados
5. ✅ Pipeline completo!

### 2. Verificar imagens no registry
```powershell
# Listar imagens no registry
curl http://localhost:5000/v2/_catalog

# Ver tags de uma imagem
curl http://localhost:5000/v2/myapp/tags/list
```

### 3. Executar a aplicação publicada
```powershell
docker run -d -p 8000:8000 localhost:5000/myapp:latest
```

Acesse: http://localhost:8000

### 4. Ver logs de um serviço específico
```powershell
# Logs do builder
docker compose logs builder

# Logs dos testes
docker compose logs app

# Logs do registry
docker compose logs registry
```

### 5. Re-executar apenas os testes
```powershell
docker compose run --rm app
```

### 6. Re-executar apenas o build
```powershell
docker compose run --rm builder
```

### 7. Limpar tudo
```powershell
docker compose down -v
```

## Fluxo do Pipeline

```
┌─────────────┐
│  Registry   │  ← Armazena imagens
└─────────────┘
      ↑
      │ push
      │
┌─────────────┐
│   Builder   │  ← Constrói imagem
└─────────────┘
      ↓
      │ depends_on
      ↓
┌─────────────┐
│  App/Tests  │  ← Executa testes
└─────────────┘
```

## Entendendo Docker-in-Docker

### Por que usar DinD?
- Isolamento completo do Docker host
- Ambiente limpo para cada build
- Simula CI/CD real (GitHub Actions, GitLab CI)

### Configuração
```yaml
docker:
  image: docker:24-dind
  privileged: true  # Necessário!
  environment:
    DOCKER_TLS_CERTDIR: ""  # Desabilita TLS para simplificar
```

### Conectando ao DinD
```yaml
builder:
  environment:
    DOCKER_HOST: tcp://docker:2375  # Aponta para DinD
```

## Testes Pytest

### Estrutura dos Testes
- Testes de endpoints Flask
- Testes de funções isoladas
- Testes de tipos e edge cases
- Cobertura de código

### Executar testes localmente
```powershell
cd app
pip install -r requirements.txt pytest pytest-cov
pytest -v --cov=.
```

### Relatório de Cobertura
```powershell
pytest --cov=. --cov-report=html
```

Abre relatório em `htmlcov/index.html`

## Expansões do Pipeline

### Adicionar Linting
```yaml
linter:
  image: python:3.11-alpine
  command: sh -c "
    pip install flake8 &&
    flake8 . --max-line-length=100
  "
```

### Adicionar Scan de Segurança
```yaml
security:
  image: aquasec/trivy
  command: image localhost:5000/myapp:latest
```

### Adicionar Deploy
```yaml
deploy:
  depends_on:
    - app
  command: sh -c "
    echo 'Deploying to production...' &&
    # Comandos de deploy aqui
  "
```

## CI/CD Real

Este setup simula pipelines de CI reais:

### GitHub Actions equivalente:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: docker build -t myapp .
      - name: Test
        run: pytest
      - name: Push
        run: docker push registry/myapp
```

### GitLab CI equivalente:
```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - docker build -t myapp .

test:
  stage: test
  script:
    - pytest -v
```

## Troubleshooting

### DinD não inicia?
- Verificar se Docker Desktop permite containers privilegiados
- No Windows: Habilitar WSL2 backend

### Builder falha ao conectar?
- Aguardar DinD iniciar completamente (~10s)
- Adicionar `sleep 10` antes do build

### Registry não aceita push?
- Verificar se registry está rodando: `docker compose ps`
- Verificar network: `docker network ls`

### Testes falham?
- Ver logs detalhados: `docker compose logs app`
- Executar localmente para debug

## Métricas do Pipeline

Após execução, você pode ver:
- ✅ Tempo de build
- ✅ Cobertura de testes
- ✅ Tamanho da imagem
- ✅ Sucesso/falha de cada etapa

## Benefícios

🚀 **Rapidez**: Pipeline local rápido  
🔒 **Segurança**: Ambiente isolado  
🧪 **Qualidade**: Testes automáticos  
📦 **Reprodutível**: Mesmo resultado sempre  
🎓 **Aprendizado**: Entender CI/CD na prática
