# Exercício 1: Imagem Alpine com Saudação
FROM alpine:latest

# Instalar bash e curl
RUN apk add --no-cache bash curl

# Criar arquivo com a mensagem de saudação
RUN echo "Bom dia! Café quente e build verde." > /motd.txt

# Configurar para exibir a mensagem ao iniciar
# e manter o terminal aberto
CMD cat /motd.txt && /bin/bash
