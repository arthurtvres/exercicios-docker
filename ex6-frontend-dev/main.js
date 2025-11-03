// Adiciona estilos
const style = document.createElement('style');
style.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  
  #app {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    max-width: 600px;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    animation: fadeIn 1s ease-in;
  }
  
  p {
    font-size: 1.2rem;
    margin: 0.5rem 0;
    opacity: 0.9;
  }
  
  .counter {
    margin: 2rem 0;
  }
  
  button {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid white;
    color: white;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 10px;
    cursor: pointer;
    margin: 0.5rem;
    transition: all 0.3s ease;
  }
  
  button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  .badge {
    display: inline-block;
    background: rgba(0, 255, 0, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    margin-top: 1rem;
    animation: pulse 2s infinite;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .time {
    font-family: 'Courier New', monospace;
    font-size: 1.5rem;
    margin-top: 1rem;
    color: #ffd700;
  }
`;
document.head.appendChild(style);

// Estado da aplicação
let count = 0;

// Função para renderizar
function render() {
  const app = document.getElementById('app');
  const now = new Date().toLocaleTimeString('pt-BR');
  
  app.innerHTML = `
    <h1>🚀 Frontend Development</h1>
    <p>Vite + Docker Compose</p>
    <p>Com Hot-Reload Ativado!</p>
    
    <div class="counter">
      <h2>Contador: ${count}</h2>
      <button id="increment">➕ Incrementar</button>
      <button id="decrement">➖ Decrementar</button>
      <button id="reset">🔄 Reset</button>
    </div>
    
    <div class="badge">
      ✅ Hot-Reload Funcionando
    </div>
    
    <div class="time">
      🕐 ${now}
    </div>
    
    <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.7;">
      Edite o arquivo <code>main.js</code> e veja as mudanças instantaneamente!
    </p>
  `;
  
  // Adicionar event listeners
  document.getElementById('increment').addEventListener('click', () => {
    count++;
    render();
  });
  
  document.getElementById('decrement').addEventListener('click', () => {
    count--;
    render();
  });
  
  document.getElementById('reset').addEventListener('click', () => {
    count = 0;
    render();
  });
}

// Renderizar inicialmente
render();

// Atualizar relógio a cada segundo
setInterval(() => {
  const timeElement = document.querySelector('.time');
  if (timeElement) {
    const now = new Date().toLocaleTimeString('pt-BR');
    timeElement.textContent = `🕐 ${now}`;
  }
}, 1000);

console.log('🎨 Frontend carregado com sucesso!');
console.log('✨ Hot-reload está ativo - faça mudanças e veja a mágica acontecer!');
