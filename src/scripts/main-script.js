const diamonds = [
  "black",
  "blue",
  "brown",
  "cyan",
  "gray",
  "green",
  "orange",
  "pink",
  "purple",
  "red",
  "white",
  "yellow",
];

function getRandomDiamondImage() {
  const random = Math.floor(Math.random() * diamonds.length);
  const diamondChosen = diamonds[random];
  return `./assets/diamonds/${diamondChosen}.png`;
}
let diamondSrcImage = "";

function pickRandomDiamondImage() {
  diamondSrcImage = getRandomDiamondImage();
}

// document.addEventListener("DOMContentLoaded", function () {
const grid = document.getElementById("grid");
const size = 8; // Tamanho do campo minado //8x8
const bombCount = 10; // Número de bombas
let isGameRevealed = false;

let gameGrid = [];

// Função para criar o campo minado
function createGrid() {
  pickRandomDiamondImage();

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const block = document.createElement("div");
      block.classList.add("mine-block");

      block.dataset.x = i;
      block.dataset.y = j;
      grid.appendChild(block);
      block.addEventListener("click", handleClick);
      gameGrid.push({ x: i, y: j, hasBomb: false, revealed: false });
    }
  }
  placeBombs();
}

// Função para distribuir as bombas aleatoriamente
function placeBombs() {
  let bombsPlaced = 0;
  console.log("------------ Onde as bombas estão plantadas ------------ ");
  while (bombsPlaced < bombCount) {
    const randomIndex = Math.floor(Math.random() * gameGrid.length);
    if (!gameGrid[randomIndex].hasBomb) {
      console.log(gameGrid[randomIndex]);

      gameGrid[randomIndex].hasBomb = true;
      bombsPlaced++;
    }
  }
}

// Função para lidar com o clique em um bloco
function handleClick(event) {
  if (isGameRevealed) return;
  const block = event.target;
  const x = parseInt(block.dataset.x);
  const y = parseInt(block.dataset.y);

  // Verifica se o bloco clicado tem uma bomba
  const clickedBlock = gameGrid.find((block) => block.x === x && block.y === y);

  if (clickedBlock.revealed) return;

  if (clickedBlock.hasBomb) {
    block.classList.add("bomb");
    block.innerHTML = createIconImgEl("bomb");

    // block.textContent = "💣";
    revealAllBlocks();
    alert("Você perdeu! Tente novamente.");

    // --- Reniciar o jogo
    setTimeout(() => {
      resetGame();
      isGameRevealed = false;
    }, 10000);
  } else {
    block.classList.add("diamond");
    block.classList.add("revealed");
    block.innerHTML = createIconImgEl("diamond");
    // block.textContent = "💎"; // Adiciona o ícone de diamante
    checkWinCondition();
  }
}

// Função para revelar todos os blocos no final do jogo
function revealAllBlocks() {
  isGameRevealed = true;

  gameGrid.forEach((block) => {
    const blockElement = document.querySelector(
      `.mine-block[data-x="${block.x}"][data-y="${block.y}"]`
    );
    if (block.hasBomb) {
      blockElement.classList.add("bomb");
      blockElement.innerHTML = createIconImgEl("bomb");
      // blockElement.textContent = "💣";
    } else {
      blockElement.classList.add("revealed");
    }
  });
}

// Função para verificar se o jogador ganhou o jogo
function checkWinCondition() {
  let unrevealedSafeBlocks = gameGrid.filter(
    (block) => !block.hasBomb && !block.revealed
  ).length;
  if (unrevealedSafeBlocks === 0) {
    revealAllBlocks();
    alert("Parabéns! Você ganhou!");
    resetGame();
  }
}

// Função para reiniciar o jogo
function resetGame() {
  grid.innerHTML = "";
  gameGrid = [];
  createGrid();
}

createGrid();
// });

/**
 * @param {"diamond" | "bomb"} icon
 * @returns string
 */
function createIconImgEl(icon) {
  let iconImageSrc;

  if (icon == "bomb") {
    iconImageSrc = "./assets/bomb.png";
  } else if (icon == "diamond") {
    iconImageSrc = diamondSrcImage;
  }

  return `<img src='${iconImageSrc}' class='w-12 h-12' alt='${icon}'/>`;
}
