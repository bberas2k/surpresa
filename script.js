// Configuração do Canvas para os fogos de artifício
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Função para gerar uma cor aleatória para cada grupo de fogos
function getRandomColor() {
  const colors = [
    'rgba(255, 215, 0, 1)',   // Dourado
    'rgba(255, 0, 0, 1)',     // Vermelho
    'rgba(0, 255, 0, 1)',     // Verde
    'rgba(0, 0, 255, 1)',     // Azul
    'rgba(255, 165, 0, 1)',   // Laranja
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Classe para criar uma partícula com rastro
class Firework {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2; // Tamanho inicial da partícula
    this.speedX = Math.random() * 6 - 3; // Velocidade horizontal
    this.speedY = Math.random() * 6 - 3; // Velocidade vertical
    this.color = color; // A cor única para cada grupo de fogos
    this.life = 100; // Tempo de vida da partícula
    this.trail = []; // Rastro da partícula
  }

  // Método para atualizar e desenhar a partícula
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += 0.05; // Gravidade, acelera as partículas para baixo
    this.life -= 1;

    // Adiciona a posição atual ao rastro
    this.trail.push({ x: this.x, y: this.y });

    // Limita o número de elementos no rastro para evitar sobrecarga
    if (this.trail.length > 15) {
      this.trail.shift();
    }
  }

  // Método para desenhar a partícula
  draw() {
    // Desenha o rastro com diminuição do tamanho e opacidade ao longo do tempo
    for (let i = 0; i < this.trail.length; i++) {
      const trailPart = this.trail[i];
      // A opacidade diminui conforme a partícula se afasta
      const opacity = (i + 1) / this.trail.length;
      const size = this.size * (1 - (i / this.trail.length)); // Fica mais fino conforme se afasta

      ctx.fillStyle = `${this.color.slice(0, 4)}, ${opacity})`; // Aplica a cor do grupo ao rastro
      ctx.beginPath();
      ctx.arc(trailPart.x, trailPart.y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Desenha a partícula principal
    ctx.fillStyle = this.color; // Aplica a cor do grupo à partícula principal
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Verifica se a partícula ainda está viva
  isAlive() {
    return this.life > 0;
  }
}

// Função para gerar uma explosão de fogos
function generateFirework(x, y) {
  const color = getRandomColor(); // Cada grupo tem uma cor única
  const particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push(new Firework(x, y, color)); // Gera 100 partículas por explosão
  }
  return particles;
}

// Array para armazenar as partículas ativas
let fireworks = [];

// Função de animação
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (!firework.isAlive()) {
      fireworks.splice(index, 1); // Remove a partícula quando morrer
    }
  });
  requestAnimationFrame(animate); // Solicita o próximo quadro de animação
}

// Função para disparar um fogo de artifício no centro da tela
function launchFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  fireworks = fireworks.concat(generateFirework(x, y)); // Adiciona novas partículas
}

// Dispara fogos de artifício a cada 1.5 segundos
// OBS: Somente será disparado quando o "Sim" for clicado

// Quando o botão "Sim" for clicado
document.getElementById('yesBtn').addEventListener('click', () => {
  document.getElementById('loveMessage').style.display = 'block';  // Exibe a mensagem "Eu Te Amo!"
  alert('Que ótimo! Vamos viver essa história juntos! 💖');
  setInterval(launchFirework, 1500); // Inicia o disparo de fogos de artifício
});

// Movimento do botão "Não" para cima e para baixo
let noBtn = document.getElementById('noBtn');
let direction = 1;  // 1 para baixo, -1 para cima
let moveDistance = 10; // Distância que o botão irá mover

function moveNoButton() {
  let currentTop = parseInt(window.getComputedStyle(noBtn).top || 0);
  if (currentTop > 50) direction = -1;  // Quando o botão atingir o limite inferior, vai para cima
  if (currentTop < 0) direction = 1;  // Quando o botão atingir o limite superior, vai para baixo

  noBtn.style.top = `${currentTop + (direction * moveDistance)}px`;
}

setInterval(moveNoButton, 100);  // Faz o botão "Não" se mover a cada 100ms
