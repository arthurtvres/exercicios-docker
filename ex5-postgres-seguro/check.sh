#!/bin/bash
set -e

echo "🔐 Iniciando verificação de conexão ao PostgreSQL..."
echo "================================"

# Verificar se as variáveis de ambiente foram definidas
if [ -z "$DB_HOST" ]; then
  echo "❌ Erro: DB_HOST não definido"
  exit 1
fi

if [ -z "$DB_USER" ]; then
  echo "❌ Erro: DB_USER não definido"
  exit 1
fi

if [ -z "$DB_PASS" ]; then
  echo "❌ Erro: DB_PASS não definido"
  exit 1
fi

# Definir valores padrão opcionais
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-postgres}

echo "📡 Configurações:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Database: $DB_NAME"
echo "  Password: ********"
echo "================================"

# Construir string de conexão (senha via variável de ambiente PGPASSWORD)
export PGPASSWORD="$DB_PASS"

echo "🔄 Tentando conectar ao banco de dados..."

# Executar teste de conexão
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1 AS connection_test, NOW() AS current_time;" > /dev/null 2>&1; then
  echo "✅ Conexão estabelecida com sucesso!"
  
  # Executar query de teste e exibir resultado
  echo ""
  echo "📊 Informações do banco:"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
      current_database() AS database,
      current_user AS user,
      version() AS version,
      NOW() AS timestamp;
  "
  
  # Testar criação de tabela (se permissões permitirem)
  echo ""
  echo "🧪 Testando permissões de escrita..."
  if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    CREATE TABLE IF NOT EXISTS health_check (
      id SERIAL PRIMARY KEY,
      check_time TIMESTAMP DEFAULT NOW(),
      status VARCHAR(50)
    );
    INSERT INTO health_check (status) VALUES ('OK');
    SELECT * FROM health_check ORDER BY check_time DESC LIMIT 5;
  " > /dev/null 2>&1; then
    echo "✅ Permissões de escrita OK"
  else
    echo "⚠️  Sem permissões de escrita (somente leitura)"
  fi
  
  echo ""
  echo "================================"
  echo "🎉 Verificação concluída com sucesso!"
  exit 0
else
  echo "❌ Falha na conexão ao banco de dados"
  echo "================================"
  exit 1
fi

# Limpar senha da memória
unset PGPASSWORD
