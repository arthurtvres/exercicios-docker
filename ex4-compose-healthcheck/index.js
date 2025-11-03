const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin:senha123@localhost:5432/biblioteca',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware para parse de JSON
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>App com Healthcheck</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          }
          h1 { margin: 0 0 1rem 0; }
          .links { margin-top: 1rem; }
          .links a {
            color: white;
            text-decoration: none;
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            margin: 0 0.5rem;
            display: inline-block;
            margin-top: 0.5rem;
          }
          .links a:hover { background: rgba(255,255,255,0.3); }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🏥 App com Healthcheck</h1>
          <p>Aplicação Node.js + PostgreSQL</p>
          <p>🐳 Docker Compose com depends_on</p>
          <div class="links">
            <a href="/health">Ver Health Status</a>
            <a href="/db-status">Status do Banco</a>
            <a href="/livros">Lista de Livros</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Rota de healthcheck da aplicação
app.get('/health', async (req, res) => {
  try {
    // Testa a conexão com o banco
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbTime: result.rows[0].now
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Rota para verificar status do banco
app.get('/db-status', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `);
    res.json({
      status: 'connected',
      info: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Rota para criar tabela e inserir dados de exemplo
app.get('/setup', async (req, res) => {
  try {
    // Criar tabela
    await pool.query(`
      CREATE TABLE IF NOT EXISTS livros (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        autor VARCHAR(255) NOT NULL,
        ano INTEGER
      )
    `);

    // Inserir dados de exemplo
    await pool.query(`
      INSERT INTO livros (titulo, autor, ano) VALUES
      ('Clean Code', 'Robert C. Martin', 2008),
      ('The Pragmatic Programmer', 'Andrew Hunt', 1999),
      ('Docker Deep Dive', 'Nigel Poulton', 2023)
      ON CONFLICT DO NOTHING
    `);

    res.json({
      status: 'success',
      message: 'Tabela criada e dados inseridos com sucesso!'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Rota para listar livros
app.get('/livros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM livros ORDER BY id');
    
    if (result.rows.length === 0) {
      res.send(`
        <html>
          <head><title>Livros</title></head>
          <body style="font-family: Arial; padding: 2rem; background: #f5f5f5;">
            <h2>📚 Nenhum livro encontrado</h2>
            <p>Execute primeiro: <a href="/setup">/setup</a> para criar dados de exemplo</p>
            <p><a href="/">← Voltar</a></p>
          </body>
        </html>
      `);
    } else {
      const livrosHtml = result.rows.map(livro => 
        `<li><strong>${livro.titulo}</strong> - ${livro.autor} (${livro.ano})</li>`
      ).join('');
      
      res.send(`
        <html>
          <head><title>Livros</title></head>
          <body style="font-family: Arial; padding: 2rem; background: #f5f5f5;">
            <h2>📚 Lista de Livros</h2>
            <ul>${livrosHtml}</ul>
            <p><a href="/">← Voltar</a></p>
          </body>
        </html>
      `);
    }
  } catch (error) {
    res.status(500).send(`
      <html>
        <head><title>Erro</title></head>
        <body style="font-family: Arial; padding: 2rem; background: #ffe0e0;">
          <h2>❌ Erro ao buscar livros</h2>
          <p>${error.message}</p>
          <p>Talvez a tabela ainda não exista. Execute: <a href="/setup">/setup</a></p>
          <p><a href="/">← Voltar</a></p>
        </body>
      </html>
    `);
  }
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Database URL: ${process.env.DATABASE_URL}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
});
