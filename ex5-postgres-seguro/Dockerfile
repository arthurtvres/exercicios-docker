# Exercício 5: Acesso Seguro ao PostgreSQL
FROM alpine:latest

# Instalar postgresql-client
RUN apk add --no-cache postgresql-client bash

# Criar diretório para scripts
WORKDIR /app

# Copiar script de verificação
COPY check.sh /app/check.sh

# Dar permissão de execução
RUN chmod +x /app/check.sh

# Executar o script ao iniciar
ENTRYPOINT ["/app/check.sh"]
