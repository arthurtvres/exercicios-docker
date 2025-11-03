# Exercício 1 - Imagem Alpine com Saudação

## Objetivo
Criar uma imagem leve baseada em Alpine que exiba uma saudação ao iniciar.

## Características
- Imagem base: `alpine:latest`
- Pacotes instalados: `bash` e `curl`
- Mensagem customizada em `/motd.txt`
- Terminal interativo aberto após a mensagem

## Como Executar

### Construir a imagem
```powershell
docker build -t cafe:1 .
```

### Executar o contêiner
```powershell
docker run -it cafe:1
```

## Resultado Esperado
O contêiner deve:
1. Exibir a mensagem: "Bom dia! Café quente e build verde."
2. Manter o terminal aberto para digitação de comandos
3. Permitir uso de bash e curl
