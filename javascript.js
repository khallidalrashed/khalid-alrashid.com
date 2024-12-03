const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let grid = [];
let player = { x: 4, y: 0, score: 0, energy: 100 };
const tileSize = 40;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;
let timer = 60;
let gameInterval;
let gameEnded = false; // --- LINE ADDED BY: Ryan Garcia --- // Tracks if the game has ended
let difficulty = 1;
let face = '🙂';

function initGrid() {
  grid = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => {
      let type;
      if (Math.random() < 0.15) type = 'gem';
      else if (Math.random() < 0.05) type = 'diamond';
      else if (Math.random() < 0.1 * difficulty) type = 'trap';
      else type = 'dirt';
      return { type, collapsed: false };
    })
  );
  grid[0][player.x] = { type: 'empty' };
}


function getPlayerFace() {
  if (player.energy > 70) {
    return '😊'; // Happy face
  } else if (player.energy > 30) {
    return '😐'; // Neutral face
  } else {
    return '😞'; // Sad face
  }
}
// --- ENTIRE FUNCTION REVISED BY: Ryan Garcia ---
// Added gradient color for traps (Lava/Magma) along with adding diamonds for gems that add time to timer
function drawGrid() {
  grid.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile.type === 'gem') ctx.fillStyle = '#FFD700';// Gold for gems
      else if (tile.type === 'diamond') ctx.fillStyle = '#00BFFF';// Cyan for diamonds
      else if (tile.type === 'trap') {
      // Add magma effect with black and red accents
        const gradient = ctx.createRadialGradient(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          tileSize / 4,
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          tileSize
        );
        gradient.addColorStop(0, '#FF4500'); // Lava red
        gradient.addColorStop(0.5, '#000000'); // Black accents
        gradient.addColorStop(1, '#FFD700'); // Yellow for depth
        ctx.fillStyle = gradient;
      } else if (tile.type === 'dirt') {
        ctx.fillStyle = '#654321'; // Brown for dirt
      } else {
        ctx.fillStyle = '#3a3a3a'; // Background
      }
      if (tile.type !== 'collapsed') {
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    });
  });
}


function drawPlayer() {
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(
    player.x * tileSize + 5,
    player.y * tileSize + 5,
    tileSize - 10,
    tileSize - 10
  );
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000"; // Black color for the emoji
  ctx.fillText(face, player.x * tileSize + tileSize / 2, player.y * tileSize + tileSize / 2);
}

function updateStats() {
  document.getElementById('score').textContent = `Score: ${player.score}`;
  document.getElementById('energy').textContent = `Energy: ${player.energy}%`;
  document.getElementById('timer').textContent = `Time: ${timer}s`;
}

function movePlayer(dx, dy) {
  if (player.energy <= 0) return alert('Out of energy! Game over!');

  const newX = player.x + dx;
  const newY = player.y + dy;

  if (newX < 0 || newX >= cols || newY >= rows) return;

  const targetTile = grid[newY][newX];
  if (targetTile.type !== 'collapsed') {
    player.x = newX;
    player.y = newY;

    if (targetTile.type === 'gem') {
      player.score += 10;
    } else if (targetTile.type === 'diamond') {
      player.score += 50;
      timer += 10;
    } else if (targetTile.type === 'trap') {
      alert('You hit a trap! Game over!');
      stopGame();
      return;
    }

    grid[newY][newX] = { type: 'empty' };
    player.energy -= 5;
  }

  if (Math.random() < 0.1) collapseTile();

  updateStats();
}

function collapseTile() {
  const x = Math.floor(Math.random() * cols);
  const y = Math.floor(Math.random() * rows);
  if (grid[y][x].type !== 'empty') grid[y][x].type = 'collapsed';
}

// --- FUNCTION REVISED BY: Ryan Garcia --- // Added timer and loop to halt timer and resest once game is over
function gameLoop() {
  if (gameEnded) return; // Stop the loop if the game is over
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawPlayer();
  if (player.energy > 0 && timer > 0) requestAnimationFrame(gameLoop);
  else stopGame();
}

// --- FUNCTION ADDED BY: Ryan Garcia --- // Sets timer which starts at 60 seconds via HTML
function startTimer() {
  gameInterval = setInterval(() => {
    if (!gameEnded) {
      timer--;
      updateStats();
      if (timer <= 0) {
        gameEnded = true; // Mark the game as ended
        alert('Time’s up! Game over!');
        stopGame();
      }
    }
  }, 1000);
}

function stopGame() {
  gameEnded = true; // --- LINE ADDED BY: Ryan Garcia --- // Stops game logic
  clearInterval(gameInterval);
}

document.getElementById('start-button').addEventListener('click', () => {
  player = { x: 4, y: 0, score: 0, energy: 100 };
  timer = 60;
  gameEnded = false; // --- LINE ADDED BY: Ryan Garcia --- // Resets game state
  difficulty = 1 + player.score / 100; // --- LINE ADDED BY: Ryan Garcia --- // Increases difficulty as score increases
  initGrid();
  updateStats();
  startTimer();
  gameLoop();
});

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') movePlayer(0, -1);
  if (e.key === 'ArrowDown') movePlayer(0, 1);
  if (e.key === 'ArrowLeft') movePlayer(-1, 0);
  if (e.key === 'ArrowRight') movePlayer(1, 0);
});

document.getElementById('instructions-button').addEventListener('click', () => {
  const instructions = document.getElementById('instructions');
  instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
});

