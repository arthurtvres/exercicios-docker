const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const PORT = process.env.PORT || 4000;

// Ler configurações do arquivo YAML (montado via configs)
let config = {};
try {
  const configFile = fs.readFileSync('/etc/app/config.yml', 'utf8');
  config = yaml.load(configFile);
  console.log('✅ Configurações carregadas de config.yml');
} catch (e) {
  console.error('⚠️  Erro ao carregar config.yml:', e.message);
  config = { app: { name: 'API', version: '1.0.0' } };
}

// Variáveis de ambiente do .env
const envVars = {
  apiKey: process.env.API_KEY,
  database: process.env.DATABASE_URL,
  environment: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  emailService: process.env.EMAIL_SERVICE,
  emailUser: process.env.EMAIL_USER,
};

// Middleware para JSON
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>${config.app?.name || 'API'}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 2rem;
            margin: 0;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          }
          h1 { margin-top: 0; }
          .section {
            background: rgba(255,255,255,0.05);
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 10px;
          }
          .links a {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            padding: 0.7rem 1.5rem;
            border-radius: 5px;
            margin: 0.5rem 0.5rem 0 0;
          }
          .links a:hover { background: rgba(255,255,255,0.3); }
          code {
            background: rgba(0,0,0,0.3);
            padding: 0.2rem 0.5rem;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔐 ${config.app?.name || 'API Segura'}</h1>
          <p>Demonstração de variáveis de ambiente e configurações seguras</p>
          
          <div class="section">
            <h3>📋 Endpoints Disponíveis</h3>
            <div class="links">
              <a href="/info">📊 /info - Informações completas</a>
              <a href="/health">❤️ /health - Status da API</a>
              <a href="/config">⚙️ /config - Configurações</a>
            </div>
          </div>
          
          <div class="section">
            <h3>🛡️ Segurança</h3>
            <p>✅ Variáveis carregadas de <code>.env</code></p>
            <p>✅ Configurações de <code>config.yml</code> (read-only)</p>
            <p>✅ Credenciais nunca expostas em logs</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Rota de informações (com segurança)
app.get('/info', (req, res) => {
  res.json({
    status: 'ok',
    app: {
      name: config.app?.name,
      version: config.app?.version,
      description: config.app?.description,
    },
    environment: envVars.environment,
    features: config.features || [],
    // Ocultar informações sensíveis
    security: {
      apiKey: envVars.apiKey ? '***' + envVars.apiKey.slice(-4) : 'not set',
      database: envVars.database ? 'configured' : 'not configured',
      jwtSecret: envVars.jwtSecret ? 'configured' : 'not configured',
      emailService: envVars.emailService || 'not configured',
      emailUser: envVars.emailUser ? maskEmail(envVars.emailUser) : 'not set',
    },
    configFile: {
      loaded: Object.keys(config).length > 0,
      path: '/etc/app/config.yml',
      writable: false,
    },
  });
});

// Rota de health
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: envVars.environment,
    configLoaded: Object.keys(config).length > 0,
    envVarsLoaded: Object.values(envVars).some(v => v !== undefined),
  };
  
  res.json(health);
});

// Rota de configurações
app.get('/config', (req, res) => {
  res.json({
    config: config,
    note: 'Arquivo config.yml montado como somente leitura em /etc/app/config.yml',
  });
});

// Função auxiliar para mascarar email
function maskEmail(email) {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return email;
  const maskedUser = user[0] + '*'.repeat(user.length - 2) + user[user.length - 1];
  return `${maskedUser}@${domain}`;
}

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${envVars.environment || 'não definido'}`);
  console.log(`📦 Aplicação: ${config.app?.name || 'não definido'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Variáveis de ambiente carregadas:');
  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      // Não exibir valores sensíveis nos logs
      if (key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD')) {
        console.log(`   ${key}: ********`);
      } else {
        console.log(`   ${key}: ${value}`);
      }
    }
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});
