import { siteJumpSound, siteDeathSound, sitePointsound } from "./soundEffect.js";
import { dinosaurData } from "./dataScores.js";

// Initialize variables for the game board, dinosaur, cacti, and game parameters
let board;
let boardWidth = 750; // Width of the game board
let boardHeight = 250; // Height of the game board
export let context;
let scoreText = "Hi " + dinosaurData.highestScore;

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
let cactusArr = []; // Array to store cactus objects
let cactus1Width = 34; // Width of the first type of cactus
let cactus2Width = 69; // Width of the second type of cactus
let cactus3Width = 102; // Width of the third type of cactus
let cactusHeight = 70; // Height of the cacti
let cactusX = 700; // Initial X position of the cacti
let cactusY = boardHeight - cactusHeight; // Y position of the cacti
let cactus1Img; // Image object for the first type of cactus
let cactus2Img; // Image object for the second type of cactus
let cactus3Img; // Image object for the third type of cactus
let land;

// Game physics
let velocityX = -8; // Horizontal velocity of the game objects
let velocityY = 0; // Vertical velocity of the game objects
let gravity = 0.4; // Gravity effect

// Game state
let gameOver = false; // Flag to indicate if the game is over
let score = 0; // Player's score

// Load game assets and start game loop
window.onload = function () {
  // Get the game canvas element
  board = document.getElementById("board");
  // Set the canvas dimensions
  board.height = boardHeight;
  board.width = boardWidth;
  // Get the 2D rendering context
  context = board.getContext("2d");

  // Load dinosaur image
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

  // Start the game loop
  requestAnimationFrame(update);
  // Place cacti periodically
  setInterval(placeCactus, 1000);
  // Listen for key events to control the dinosaur
  document.addEventListener("keydown", moveDino);
  document.addEventListener("keydown", soundEffect);
};

// Main game loop
function update() {
  requestAnimationFrame(update);
  if (gameOver) {
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
      dinoImg.src = ".assets/dino-dead.png";
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
    }
  }

  // Display the score
  context.fillStyle = "black";
  context.font = "20px courier";
  score++;
  context.fillText(score, 680, 20);
  context.fillText(scoreText, 600, 20);
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
  // Move dinosaur downwards when ArrowDown is pressed
  else if (e.code == "ArrowDown" && dino.y == dinoY) {
    velocityX = -8; // Reset horizontal velocity
    velocityY = 0; // Reset vertical velocity
    gravity = 0.4; // Reset gravity
  }
}
function soundEffect(e) {
  if (e.code === "Space" || e.code == "ArrowUp")
    siteJumpSound.play();
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
    cactus.shift();
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
  console.log(e);
  const btnType = e.code;

  if (btnType === "Space") {

  }
}

function init() {
  document.addEventListener("keydown", pressSpace);
}
init();