// ---------- Variables ----------
const squares = document.querySelectorAll(".square");
const colorDisplay = document.querySelector("#colorDisplay");
const messageDisplay = document.querySelector("#message");
const h1 = document.querySelector("h1");
const resetButton = document.querySelector("#reset");
const modeButtons = document.querySelectorAll(".mode");
const streakDisplay = document.querySelector("#streak");
const bestStreakDisplay = document.querySelector("#bestStreak");
const winsDisplay = document.querySelector("#wins");
const bodyColor = "#14161f"; // mismo color que el fondo del <body> en style.css

let numSquares = 6;
let colors;
let pickedColor;

// Puntaje: racha actual, mejor racha y aciertos totales
let streak = 0;
let bestStreak = cargarMejorRacha();
let wins = 0;
let yaRespondio = false; // evita que un mismo color sume o corte la racha dos veces

// ---------- Ejecución ----------
init();
resetButton.addEventListener("click", reset);

// ---------- Funciones ----------
function init() {
  setupModeButtons();
  setupSquares();
  reset();
  updateScoreboard();
}

function setupModeButtons() {
  for (let i = 0; i < modeButtons.length; i++) {
    modeButtons[i].addEventListener("click", function () {
      modeButtons[0].classList.remove("selected");
      modeButtons[1].classList.remove("selected");
      this.classList.add("selected");
      numSquares = this.textContent === "Easy" ? 3 : 6;
      reset();
    });
  }
}

function setupSquares() {
  for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", function () {
      const clickedColor = this.style.backgroundColor;
      if (clickedColor === pickedColor) {
        messageDisplay.textContent = "¡Correcto!";
        resetButton.textContent = "Play Again?";
        h1.style.backgroundColor = clickedColor;
        changeColors(clickedColor);
        if (!yaRespondio) {
          sumarAcierto();
          yaRespondio = true;
        }
      } else {
        this.style.backgroundColor = bodyColor;
        messageDisplay.textContent = "Intentalo nuevamente";
        if (!yaRespondio) {
          perderRacha();
          yaRespondio = true;
        }
      }
    });
  }
}

function reset() {
  colors = generateRandomColors(numSquares);
  pickedColor = pickColor();
  colorDisplay.textContent = pickedColor;
  resetButton.textContent = "Nuevos Colores";
  messageDisplay.textContent = "";
  h1.style.backgroundColor = "";
  yaRespondio = false;
  for (let i = 0; i < squares.length; i++) {
    if (colors[i]) {
      squares[i].style.display = "block";
      squares[i].style.backgroundColor = colors[i];
    } else {
      squares[i].style.display = "none";
    }
  }
}

function changeColors(color) {
  for (let i = 0; i < squares.length; i++) {
    squares[i].style.backgroundColor = color;
  }
}

function pickColor() {
  const random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function generateRandomColors(num) {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(randomColor());
  }
  return arr;
}

// ---------- Funciones del puntaje ----------
function sumarAcierto() {
  streak = streak + 1;
  wins = wins + 1;
  if (streak > bestStreak) {
    bestStreak = streak;
    guardarMejorRacha(bestStreak);
  }
  updateScoreboard();
  animarScore("pop");
}

function perderRacha() {
  if (streak > 0) {
    animarScore("fail");
  }
  streak = 0;
  updateScoreboard();
}

function updateScoreboard() {
  streakDisplay.textContent = streak;
  bestStreakDisplay.textContent = bestStreak;
  winsDisplay.textContent = wins;
}

function animarScore(clase) {
  const caja = streakDisplay.parentElement;
  caja.classList.remove("pop", "fail");
  void caja.offsetWidth; // reinicia la animación
  caja.classList.add(clase);
}

function cargarMejorRacha() {
  try {
    return Number(localStorage.getItem("bestStreak")) || 0;
  } catch (error) {
    return 0;
  }
}

function guardarMejorRacha(valor) {
  try {
    localStorage.setItem("bestStreak", valor);
  } catch (error) {
    // Si el navegador no deja guardar, el juego sigue funcionando igual
  }
}
