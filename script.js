const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playButton = document.getElementById("playButton");
const replayButton = document.getElementById("replayButton");
const countdownDisplay = document.getElementById("countdown");
const scoreDisplay = document.getElementById("score");
const instructions = document.getElementById("instructions");

// Game constants
const GRAVITY = 0.5;
const FLAP = -10;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const PIPE_SPEED = 2;

// Game variables
let bird = { x: 50, y: 300, width: 30, height: 30, velocity: 0, color: "red" };
let pipes = [];
let score = 0;
let isGameOver = false;

// Create initial pipes
function createPipe() {
  const gapY = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
  pipes.push({ x: canvas.width, y: gapY });
}

// Draw the bird
function drawBird() {
  ctx.fillStyle = bird.color;
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Draw the pipes
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    // Top pipe
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.y - PIPE_GAP);
    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.y, PIPE_WIDTH, canvas.height - pipe.y);
  });
}

// Update the game state
function update() {
  if (isGameOver) return;

  // Bird mechanics
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // Move pipes
  pipes.forEach(pipe => (pipe.x -= PIPE_SPEED));

  // Remove pipes that are off-screen
  if (pipes.length > 0 && pipes[0].x + PIPE_WIDTH < 0) {
    pipes.shift();
    score++;
  }

  // Add new pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }

  // Collision detection
  pipes.forEach(pipe => {
    if (
      bird.x < pipe.x + PIPE_WIDTH &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.y - PIPE_GAP || bird.y + bird.height > pipe.y)
    ) {
      bird.color = "gray";  // Change color on collision
      isGameOver = true;
    }
  });

  // Check if bird hits the ground or goes out of bounds
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    bird.color = "gray";  // Change color on collision with ground
    isGameOver = true;
  }
}

// Draw the game frame
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();

  // Display score
  scoreDisplay.innerText = `Score: ${score}`;
}

// Game loop
function gameLoop() {
  update();
  draw();

  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  } else {
    setTimeout(() => {
      alert("Game Over! Your score: " + score);
      showReplayOption();
    }, 500);
  }
}

// Reset the game
function resetGame() {
  bird = { x: 50, y: 300, width: 30, height: 30, velocity: 0, color: "red" };
  pipes = [];
  score = 0;
  isGameOver = false;
  canvas.style.display = "block";
  createPipe();
  gameLoop();
}

// Countdown before starting the game
function startCountdown() {
  let countdown = 3;
  countdownDisplay.style.display = "block";
  countdownDisplay.innerText = countdown;

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownDisplay.innerText = countdown;
    } else {
      clearInterval(countdownInterval);
      countdownDisplay.style.display = "none";
      canvas.style.display = "block";
      gameLoop();
    }
  }, 1000);
}

// Show replay button after game over
function showReplayOption() {
  replayButton.style.display = "block";
}

// Start the game when Play button is clicked
playButton.addEventListener("click", () => {
  playButton.style.display = "none"; // Hide play button
  instructions.style.display = "none"; // Hide instructions
  startCountdown(); // Start countdown
});

// Start the game when Replay button is clicked
replayButton.addEventListener("click", () => {
  replayButton.style.display = "none"; // Hide replay button
  resetGame(); // Reset and start the game
});

// Handle user input
window.addEventListener("keydown", event => {
  if (event.code === "Space" && !isGameOver) {
    bird.velocity = FLAP;
  }
});
