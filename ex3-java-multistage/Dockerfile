# Exercício 3: Multi-stage Build para Java
# Estágio 1: Build
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /build

# Copiar arquivos de configuração do Maven
COPY pom.xml .

# Baixar dependências (cache layer)
RUN mvn dependency:go-offline

# Copiar código fonte
COPY src ./src

# Compilar o projeto
RUN mvn package -DskipTests

# Estágio 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar apenas o JAR do estágio anterior
COPY --from=builder /build/target/*.jar /app/app.jar

# Expor a porta da aplicação
EXPOSE 8080

# Definir o ponto de entrada
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
