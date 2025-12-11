const containerInstruction = document.getElementById("containerInstruction");

const gameBoard = document.getElementById("gameBoard");

const nameInput = document.getElementById("nameInput");
const buttonStart = document.getElementById("buttonStart");

nameInput.addEventListener("input", (e) => {
  console.log(nameInput.value);
  if (nameInput.value.trim() !== "") {
    buttonStart.removeAttribute("disabled");
  } else {
    buttonStart.setAttribute("disabled", true);
  }
});

function startGame() {
  if (nameInput.value.trim() !== "") {
    nameUser = nameInput.value.trim();
    nameInput.value = "";
    buttonStart.setAttribute("disabled", true);

    containerInstruction.classList.add("hidden");
    gameBoard.classList.remove("hidden");
    containerMenu.classList.add("hidden");

    gameLoop();
  }
}

const containerMenu = document.getElementById("container-menu");

let nameUser = "";

buttonStart.addEventListener("click", startGame);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    startGame();
  }
});
