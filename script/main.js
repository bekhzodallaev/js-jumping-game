// Imports
import {
  siteJumpSound,
  siteDeathSound,
  sitePointsound,
  siteBackground,
} from "./soundEffect.js";

// Constants and Variables Initialization
const enterAlert = document.querySelector("h2");
let board;
let boardWidth = 900;
let boardHeight = 300;
export let context;
let currentScore = "Score:";
let highestScoreText = "Record:";
let highestScore = 0;
let maxJumps = 0;

// Dinosaur Properties
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;
export let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

// Cactus Properties
let cactusArr = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = 850;
let cactusY = boardHeight - cactusHeight;
let cactus1Img;
let cactus2Img;
let cactus3Img;

// Game physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

// Game state
let gameOver = false;
let score = 0;
let successfulJumps = 0;
let gameOverImg = new Image();
gameOverImg.src = "./assets/game-over.png";
let resetImg = new Image();
resetImg.src = "./assets/reset.png";

// Window onload function
window.onload = function () {
  board = document.getElementById("board");
  document.addEventListener("keydown", function (event) {
    if (event.code === "Enter" && !gameOver) {
      enterAlert.style.display = "none";
      document.removeEventListener("keydown", startGame);
      startGame();
    }
  });
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // Load Dinosaur image
  dinoImg = new Image();
  dinoImg.src = "./assets/dino-stationary.png";
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

// Update function
function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    context.drawImage(gameOverImg, 250, 100);
    context.drawImage(resetImg, 400, 150);
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY);

  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

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

    if (checkCollision(dino, cactus)) {
      gameOver = true;
      siteDeathSound.play();
      dinoImg.src = "./assets/dino-dead.png";
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
    } else if (cactus.x + cactus.width < dino.x && !cactus.passed) {
      cactus.passed = true;
      successfulJumps++;
    }
  }

  context.fillStyle = "black";
  context.font = "20px courier";
  score++;
  context.fillText(score, 810, 20);
  context.fillText(currentScore, 730, 20);
  context.fillText(highestScoreText, 550, 20);
  context.fillText("Jumps: " + successfulJumps, 200, 20);
  context.fillText("Record: " + maxJumps, 50, 20);
  if (highestScore < score) {
    highestScore = score;
  }
  if (maxJumps < successfulJumps) {
    maxJumps = successfulJumps;
  }
  context.fillText(highestScore, 640, 20);

  // Increase speed when score reaches 500
  if (score >= 500) {
    velocityX = -10;
  }
}

// Function to move the dinosaur
function moveDino(e) {
  if (gameOver) {
    return;
  }
  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    velocityY = -10;
  }
  if (cactusArr.length > 0 && e.code == "ArrowUp") {
    let closestCactus = cactusArr[0];
    if (
      dino.x + dino.width > closestCactus.x &&
      dino.x < closestCactus.x + closestCactus.width
    ) {
      successfulJumps++;
      context.fillText(successfulJumps, 300, 20);
    }
  }
}

// Function to play jump sound effect
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

// Function to handle space key press
function pressSpace(e) {
  const btnType = e.code;

  if (btnType === "Space") {
  }
}

// Initialize function
function init() {
  document.addEventListener("keydown", pressSpace);
}
init();

let gameStarted = false;

// Function to start the game
function startGame() {
  if (!gameStarted) {
    siteBackground.play();
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keydown", soundEffect);
    board.addEventListener("click", function (event) {
      const rect = board.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (
        gameOver &&
        mouseX >= 400 &&
        mouseX <= 400 + resetImg.width &&
        mouseY >= 150 &&
        mouseY <= 150 + resetImg.height
      ) {
        resetGame();
      }
    });

    gameStarted = true;
  }
}

// Function to reset the game
function resetGame() {
  gameOver = false;
  score = 0;
  dino.y = dinoY;
  dinoImg.src = "./assets/dino-stationary.png";
  successfulJumps = 0;

  cactusArr = [];
}
