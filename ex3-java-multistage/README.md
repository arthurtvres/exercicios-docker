# Exercício 3 - Multi-stage Build para Java

## Objetivo
Criar uma imagem Docker multi-stage para uma aplicação Java, separando build de runtime para reduzir o tamanho final.

## Características
- **Estágio 1 (Builder)**: `maven:3.9-eclipse-temurin-17`
  - Compila o projeto com Maven
  - Gera o arquivo JAR
- **Estágio 2 (Runtime)**: `eclipse-temurin:17-jre-alpine`
  - Imagem leve apenas com JRE
  - Contém somente o JAR compilado
- Aplicação Spring Boot simples
- Porta 8080 exposta

## Estrutura de Arquivos
```
ex3-java-multistage/
├── Dockerfile
├── pom.xml
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── exemplo/
│                   └── Application.java
└── README.md
```

## Como Executar

### 1. Construir a imagem
```powershell
cd exercicios-docker\ex3-java-multistage
docker build -t java-app:1 .
```

**Nota**: O build pode levar alguns minutos na primeira vez (download de dependências Maven).

### 2. Verificar o tamanho da imagem
```powershell
docker images java-app:1
```

Compare com uma imagem sem multi-stage - a diferença é significativa!

### 3. Executar o contêiner
```powershell
docker run -d -p 8080:8080 --name java-container java-app:1
```

### 4. Testar a aplicação
Abra o navegador em: http://localhost:8080

Ou via curl/PowerShell:
```powershell
curl http://localhost:8080
curl http://localhost:8080/health
```

### 5. Ver logs
```powershell
docker logs java-container
```

### 6. Parar e remover
```powershell
docker stop java-container
docker rm java-container
```

## Benefícios do Multi-stage Build

### Redução de Tamanho
- **Com Maven completo**: ~800MB+
- **Com JRE Alpine**: ~200-250MB
- **Redução**: ~70% menor!

### Segurança
- Imagem final não contém ferramentas de build
- Menos superfície de ataque
- Apenas runtime necessário

### Separação de Responsabilidades
- Build: Maven + JDK completo
- Runtime: Apenas JRE + aplicação

## Endpoints Disponíveis
- `GET /` - Página inicial
- `GET /health` - Status da aplicação (JSON)
