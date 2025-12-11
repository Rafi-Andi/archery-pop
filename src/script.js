const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cursorImage = new Image();
cursorImage.src = "../assets/cursor.png";

const targetImage = new Image();
targetImage.src = "../assets/target.png";

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const cursor = { x: canvasWidth / 2, y: canvasHeight / 2 };

let score = 0;
const textScore = document.getElementById("textScore");

let requestFrameId = null;

const textTimer = document.getElementById("textTimer");
let secondTimer = 60;
let lastTimerUpdate = Date.now();

let isPaused = false;
let isGameOver = false;
let isGameFinish = false;

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!isGameOver) {
      pauseGame();
    }
  }
});

let scoreHistory = JSON.parse(localStorage.getItem("score-history")) || [];

const leaderboardContent = document.getElementById("leaderboardContent");

const renderHistory = (arrayScore) => {
  arrayScore.forEach((score, index) => {
    leaderboardContent.innerHTML += `<div style="padding: 10px;">
          <h3>${index + 1}. ${score.name} Score: ${score.score}</h3>
        </div>
        <hr></hr>`;
  });

};

const filterScore = document.getElementById("filterScore");

filterScore.addEventListener("input", () => {
  if (filterScore.value === "tertinggi") {
    const sortedDesc = scoreHistory.sort((a, b) => b.score - a.score);
    leaderboardContent.innerHTML = "";
    renderHistory(sortedDesc);
  } else if (filterScore.value === "terendah") {
    const sortedAsc = scoreHistory.sort((a, b) => a.score - b.score);
    leaderboardContent.innerHTML = "";
    renderHistory(sortedAsc);
  }

  if (filterScore.value === "") {
    leaderboardContent.innerHTML = "";
    renderHistory(scoreHistory);
  }
});

renderHistory(scoreHistory);

const containerGamePause = document.getElementById("gamePause");
const scorePause = document.getElementById("scorePause");
const timerPause = document.getElementById("timerPause");

const pauseGame = () => {
  isPaused = true;
  containerGamePause.classList.remove("hidden");
  scorePause.textContent = `${score}`;
  timerPause.textContent = `${formatTime(secondTimer)}`;
  requestFrameId = null;
  cancelAnimationFrame(requestFrameId);
};

const buttonResume = document.getElementById("buttonResume");
const buttonQuit = document.getElementById("buttonQuit");

buttonQuit.addEventListener("click", () => {
  if (isPaused && !isGameOver) {
    isGameOver = false;
    isPaused = false;
    textScore.textContent = `Score: ${score}`;
    secondTimer = 60;
    lives = 3;
    lastTimerUpdate = Date.now();
    targets = [];
    textTimer.textContent = `${formatTime(secondTimer)}`;
    isGameOver = false;
    score = 0;
    textScore.textContent = `Score: ${score}`;

    containerGamePause.classList.add("hidden");
    gameBoard.classList.add("hidden");
    containerInstruction.classList.remove("hidden");
    containerMenu.classList.remove("hidden");
    leaderboardContent.innerHTML = "";
    renderHistory(scoreHistory);
  }
});

const resumeGame = () => {
  isPaused = false;
  requestFrameId = requestAnimationFrame(gameLoop);
};

buttonResume.addEventListener("click", () => {
  containerGamePause.classList.add("hidden");
  resumeGame();
});

const containerGameOver = document.getElementById("gameOver");
const scoreGameOver = document.getElementById("scoreGameOver");
const heightScoreGameOver = document.getElementById("heightScoreGameOver");
const buttonMenu = document.getElementById("buttonMainMenu");
const buttonPlayAgain = document.getElementById("buttonPlayAgain");
const buttonMainMenu = document.getElementById("buttonMainMenu");
const buttonSaveScore = document.getElementById("buttonSaveScore");
const messageNewHeightScore = document.getElementById("messageNewHeightScore");

const titleGameEnd = document.getElementById("titleGameEnd");

buttonSaveScore.addEventListener("click", () => {
  scoreHistory.unshift({ name: nameUser, score: score });
  localStorage.setItem("score-history", JSON.stringify(scoreHistory));
  buttonSaveScore.setAttribute("disabled", true);
});

const drawGameOver = () => {
  if (isGameFinish) {
    titleGameEnd.textContent = "Game Finish";
  }

  if (isGameOver) {
    titleGameEnd.textContent = "Game Over";
  }

  containerGameOver.classList.remove("hidden");
  scoreGameOver.textContent = score;
  const heightScore = localStorage.getItem("heightScore") ?? 0;
  if (score > heightScore) {
    localStorage.setItem("heightScore", score);
    heightScoreGameOver.classList.remove("hidden");
    heightScoreGameOver.textContent = `
highest score : ${score}`;
    messageNewHeightScore.textContent = "New highest Score";
  } else {
    heightScoreGameOver.textContent = `
highest score : ${heightScore}`;
    messageNewHeightScore.textContent = "";
  }

  cancelAnimationFrame(requestFrameId);
  requestFrameId = null;
};

buttonPlayAgain.addEventListener("click", () => {
  if (!isPaused && (isGameOver || isGameFinish)) {
    buttonSaveScore.removeAttribute("disabled");
    scoreHistory = JSON.parse(localStorage.getItem("score-history")) || [];
    containerGameOver.classList.add("hidden");
    score = 0;
    textScore.textContent = `Score: ${score}`;
    secondTimer = 60;
    lives = 3;
    lastTimerUpdate = Date.now();
    targets = [];
    textTimer.textContent = `${formatTime(secondTimer)}`;
    isGameFinish = false;
    isGameOver = false;
    requestFrameId = requestAnimationFrame(gameLoop);
  }
});

buttonMainMenu.addEventListener("click", () => {
  if (!isPaused && (isGameOver || isGameFinish)) {
    buttonSaveScore.removeAttribute("disabled");
    scoreHistory = JSON.parse(localStorage.getItem("score-history")) || [];
    isGameFinish = false;
    isGameOver = false;
    isPaused = false;
    textScore.textContent = `Score: ${score}`;
    secondTimer = 60;
    lives = 3;
    lastTimerUpdate = Date.now();
    targets = [];
    textTimer.textContent = `${formatTime(secondTimer)}`;
    isGameOver = false;
    score = 0;
    textScore.textContent = `Score: ${score}`;

    containerGameOver.classList.add("hidden");
    gameBoard.classList.add("hidden");
    containerMenu.classList.remove("hidden");
    containerInstruction.classList.remove("hidden");
    leaderboardContent.innerHTML = "";
    renderHistory(scoreHistory);
  }
});

function formatTime(sec) {
  let mins = Math.floor((sec % 3600) / 60);
  let secs = sec % 60;

  return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

const countdownTimer = () => {
  const now = Date.now();

  if (now - lastTimerUpdate >= 1000) {
    secondTimer--;
    textTimer.textContent = `Timer: ${formatTime(secondTimer)}`;
    lastTimerUpdate = now;
  }
};

canvas.addEventListener("mousemove", (e) => {
  cursor.x = e.offsetX - 25;
  cursor.y = e.offsetY - 20;
});

canvas.addEventListener("mousedown", (e) => {
  const isTrusted = e.isTrusted;
  for (let i = targets.length - 1; i >= 0; i--) {
    if (
      e.offsetX >= targets[i].x &&
      e.offsetX - 60 <= targets[i].x &&
      e.offsetY >= targets[i].y &&
      e.offsetY - 60 <= targets[i].y
    ) {
      if (isTrusted) {
        targets.splice(i, 1);
        score += 10;
        textScore.textContent = `Score: ${score}`;
      }
    }
  }
});

const drawCursorImage = () => {
  ctx.drawImage(cursorImage, cursor.x, cursor.y, 60, 60);
};

let targets = [];

const addRandomTarget = () => {
  const xRandom = Math.floor(Math.random() * (canvasWidth - 60 - 20) + 20);
  targets.push({ x: xRandom, y: canvasHeight, vy: -10 });
};

const drawTargets = () => {
  for (let i = 0; i < targets.length; i++) {
    ctx.drawImage(targetImage, targets[i].x, targets[i].y, 60, 60);
  }
};

const spawnTargetTime = 2000;
let lastSpawnTime = Date.now();

const controlSpawnTarget = () => {
  const currentTime = Date.now();

  if (targets.length <= 0) {
    addRandomTarget();
    drawTargets();
    lastSpawnTime = currentTime;
  }

  if (currentTime - lastSpawnTime >= spawnTargetTime) {
    addRandomTarget();

    lastSpawnTime = currentTime;
  }

  drawTargets();
};

const livesImage = new Image();
livesImage.src = "../assets/lives.png";

let lives = 3;
const drawLives = () => {
  for (let i = 0; i < lives; i++) {
    ctx.drawImage(livesImage, 680 + i * 100, 20, 60, 60);
  }
};

const gravity = 0.1;

const update = () => {
  for (let i = 0; i < targets.length; i++) {
    targets[i].vy += gravity;
    targets[i].y += targets[i].vy;

    if (targets[i].y - 60 >= canvasHeight) {
      targets.splice(i, 1);
      lives -= 1;
      score -= 5;
      textScore.textContent = `Score: ${score}`;
      drawLives();
    }
  }

  if (lives <= 0) {
    isGameOver = true;
  }

  if (secondTimer <= 0) {
    isGameFinish = true;
  }
};

const gameLoop = () => {
  if (isPaused) {
    pauseGame();
  } else if (isGameOver || isGameFinish) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawGameOver();
  } else {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawLives();
    countdownTimer();
    controlSpawnTarget();
    drawCursorImage();
    update();
    requestFrameId = requestAnimationFrame(gameLoop);
  }
};
