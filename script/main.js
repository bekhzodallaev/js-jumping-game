import {
  siteJumpSound,
  siteDeathSound,
  sitePointsound,
  siteBackground,
} from "./soundEffect.js";

const enterAlert = document.querySelector("h2");
// Initialize variables for the game board, dinosaur, cacti, and game parameters
let board;
let boardWidth = 900; // Width of the game board
let boardHeight = 300; // Height of the game board
export let context;
// let scoreText = "HI " + dinosaurData.highestScore;
let currentScore = "Score:";
let highestScoreText = "Record:";
let highestScore = 0;
let maxJumps = 0;
// Dinosaur properties
let dinoWidth = 88; // Width of the dinosaur
let dinoHeight = 94; // Height of the dinosaur
let dinoX = 50; // Initial X position of the dinosaur
let dinoY = boardHeight - dinoHeight; // Initial Y position of the dinosaur
let dinoImg; // Image object for the dinosaur
export let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

// Cactus properties
let cactusArr = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = 850;
let cactusY = boardHeight - cactusHeight; // Y position of the cacti
let cactus1Img;
let cactus2Img;
let cactus3Img;

// Game physics
let velocityX = -8; // Horizontal velocity of the game objects
let velocityY = 0; // Vertical velocity of the game objects
let gravity = 0.4; // Gravity effect

// Game state
let gameOver = false; // Flag to indicate if the game is over
let score = 0; // Player's score
let successfullJumps = 0;
let gameOverImg = new Image();
gameOverImg.src = "./assets/game-over.png"; // Load game assets and start game loop
let resetImg = new Image();
resetImg.src = "./assets/reset.png";

window.onload = function () {
  // Get the game canvas element
  board = document.getElementById("board");
  // Set the canvas dimensions
  document.addEventListener("keydown", function (event) {
    // Start the game if Enter key is pressed
    if (event.code === "Enter" && !gameOver) {
      // Remove the event listener for Enter key press
      enterAlert.style.display = "none";
      document.removeEventListener("keydown", startGame);

      // Start the game
      startGame();
    }
  });
  board.height = boardHeight;
  board.width = boardWidth;
  // Get the 2D rendering context
  context = board.getContext("2d");
  //Showing highest score
  //Adding song
  dinoImg = new Image();
  dinoImg.src = "./assets/dino-stationary.png";
  // Draw the dinosaur image once loaded
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  // Load cactus images
  cactus1Img = new Image();
  cactus1Img.src = "./assets/cactus.png";

  cactus2Img = new Image();
  cactus2Img.src = "./assets/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./assets/cactus3.png";
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    context.drawImage(gameOverImg, 250, 100);
    context.drawImage(resetImg, 400, 150);
    return;
  }

  // Clear the canvas
  context.clearRect(0, 0, board.width, board.height);

  // Apply gravity to the dinosaur
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY);

  // Draw the dinosaur
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  // Draw and move cacti
  for (let i = 0; i < cactusArr.length; i++) {
    let cactus = cactusArr[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );
    // Check for collision with the dinosaur
    if (checkCollision(dino, cactus)) {
      gameOver = true;
      // Change dinosaur image to dead state
      siteDeathSound.play();
      dinoImg.src = "./assets/dino-dead.png";
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
    } else if (cactus.x + cactus.width < dino.x && !cactus.passed) {
      cactus.passed = true;
      successfullJumps++;
    }
  }

  // Display the score
  context.fillStyle = "black";
  context.font = "20px courier";
  score++;
  context.fillText(score, 810, 20);
  context.fillText(currentScore, 730, 20);
  context.fillText(highestScoreText, 550, 20);
  context.fillText("Jumps: " + successfullJumps, 200, 20);
  context.fillText("Record: " + maxJumps, 50, 20);
  if (highestScore < score) {
    highestScore = score;
  }
  if (maxJumps < successfullJumps) {
    maxJumps = successfullJumps;
  }
  context.fillText(highestScore, 640, 20);
}

// Function to move the dinosaur
function moveDino(e) {
  if (gameOver) {
    return;
  }
  // Move dinosaur upwards when Space or ArrowUp is pressed
  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    velocityY = -10;
  }
  if (cactusArr.length > 0 && e.code == "ArrowUp") {
    let closestCactus = cactusArr[0];
    if (
      dino.x + dino.width > closestCactus.x &&
      dino.x < closestCactus.x + closestCactus.width
    ) {
      successfullJumps++;
      context.fillText(successfullJumps, 300, 20);
    }
  }
}
function soundEffect(e) {
  if (e.code === "Space" || e.code == "ArrowUp") siteJumpSound.play();
}

// Function to place cacti on the game board
function placeCactus() {
  if (gameOver) {
    return;
  }
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };
  let placeRandomCactus = Math.random();
  if (placeRandomCactus > 0.9) {
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArr.push(cactus);
  } else if (placeRandomCactus > 0.7) {
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArr.push(cactus);
  } else if (placeRandomCactus > 0.05) {
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArr.push(cactus);
  }
  // Remove cactus if the array length exceeds 5
  if (cactusArr.length > 5) {
    cactusArr.shift();
  }
}

// Function to check for collision between two objects
function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function pressSpace(e) {
  const btnType = e.code;

  if (btnType === "Space") {
  }
}

function init() {
  document.addEventListener("keydown", pressSpace);
}
init();

let gameStarted = false; // Flag to track whether the game has started

function startGame() {
  if (!gameStarted) {
    // Start playing the background music
    siteBackground.play();
    // Start the game loop
    requestAnimationFrame(update);
    // Place cacti periodically
    setInterval(placeCactus, 1000);
    // Listen for key events to control the dinosaur
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keydown", soundEffect);
    board.addEventListener("click", function (event) {
      const rect = board.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Check if the click intersects with the bounding box of the reset image
      if (
        gameOver &&
        mouseX >= 400 &&
        mouseX <= 400 + resetImg.width &&
        mouseY >= 150 &&
        mouseY <= 150 + resetImg.height
      ) {
        // Reset the game
        resetGame();
      }
    });

    gameStarted = true; // Update the flag to indicate that the game has started
  }
}

function resetGame() {
  gameOver = false;
  score = 0;
  dino.y = dinoY;
  dinoImg.src = "./assets/dino-stationary.png";
  successfullJumps = 0;

  cactusArr = [];
}
