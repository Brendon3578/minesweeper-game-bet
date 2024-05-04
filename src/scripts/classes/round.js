import { DIAMONDS_IMAGE_FILENAMES, getRandomInt, sleep } from "../utils.js";

/**
 * Objeto representando um bloco em um jogo de campo minado.
 * @typedef {Object} Block
 * @property {number} x - A coordenada x do bloco.
 * @property {number} y - A coordenada y do bloco.
 * @property {boolean} hasBomb - Indica se o bloco tem uma bomba.
 * @property {boolean} revealed - Indica se o bloco foi revelado.
 */

export class Round {
  #ROUND_LOADING_NEW_GAME_MS = 10000;

  #bombCount = 10;
  #gridSize = 8;
  #diamondsCount = 0;
  #diamondSrcImage = "";
  /**
   * @type {Array<Block>}
   */
  gameGrid = [];
  isGameRevealed = false;

  #gridEl;
  #diamondTextEl;

  constructor(gridEl, diamondTextEl) {
    this.#gridEl = gridEl;
    this.#diamondTextEl = diamondTextEl;
    // precisa ter o .bind
    this.handleBlockClick = this.handleBlockClick.bind(this);
  }

  async handleBlockClick(event) {
    if (this.isGameRevealed) return;
    const block = event.target;
    const x = parseInt(block.dataset.x);
    const y = parseInt(block.dataset.y);

    // Verifica se o bloco clicado tem uma bomba
    const clickedBlock = this.gameGrid.find(
      (block) => block.x === x && block.y === y
    );

    if (clickedBlock.revealed) return;

    if (clickedBlock.hasBomb) {
      block.classList.add("bomb");
      block.innerHTML = this.#createIconImgEl("bomb");

      // block.textContent = "💣";
      this.revealAllBlocks();
      alert("Você perdeu! Tente novamente.");

      // --- Reniciar o jogo
      await sleep(this.#ROUND_LOADING_NEW_GAME_MS);

      this.isGameRevealed = false;
      this.resetRound();
    } else {
      this.removeOneDiamond();
      block.classList.add("diamond");
      block.classList.add("revealed");
      block.innerHTML = this.#createIconImgEl("diamond");
      // block.textContent = "💎"; // Adiciona o ícone de diamante
      this.checkWinCondition();
    }
  }

  #createIconImgEl(icon) {
    let iconImageSrc;

    if (icon == "bomb") {
      iconImageSrc = "./assets/bomb.png";
    } else if (icon == "diamond") {
      iconImageSrc = this.#diamondSrcImage;
    }

    return `<img src='${iconImageSrc}' class='w-12 h-12' alt='${icon}'/>`;
  }

  revealAllBlocks() {
    this.isGameRevealed = true;

    this.gameGrid.forEach((block) => {
      const blockElement = document.querySelector(
        `.mine-block[data-x="${block.x}"][data-y="${block.y}"]`
      );
      if (block.hasBomb) {
        blockElement.classList.add("bomb");
        blockElement.innerHTML = this.#createIconImgEl("bomb");
        // blockElement.textContent = "💣";
      } else {
        blockElement.classList.add("revealed");
      }
    });
  }

  createGrid() {
    for (let i = 0; i < this.#gridSize; i++) {
      for (let j = 0; j < this.#gridSize; j++) {
        const block = document.createElement("div");
        block.classList.add("mine-block");

        block.dataset.x = i;
        block.dataset.y = j;
        this.#gridEl.appendChild(block);
        this.gameGrid.push({
          x: i,
          y: j,
          hasBomb: false,
          revealed: false,
        });

        // tem que ter o .bind()
        block.addEventListener("click", this.handleBlockClick);
      }
    }
    this.placeBombs();
  }

  setDiamondsCount(diamonds) {
    this.#diamondsCount = diamonds;
  }

  removeOneDiamond() {
    this.setDiamondsCount(this.#diamondsCount - 1);
    this.updateDiamonds();
  }

  #setInitialDiamonds() {
    this.setDiamondsCount(this.#gridSize * this.#gridSize - this.#bombCount);
    this.updateDiamonds();
  }

  updateDiamonds() {
    this.#diamondTextEl.innerText = this.#diamondsCount;
  }

  #getRandomDiamondImage() {
    const randomDiamondIndex = getRandomInt(DIAMONDS_IMAGE_FILENAMES.length);
    const diamondSrcImageChosen = DIAMONDS_IMAGE_FILENAMES[randomDiamondIndex];
    return `./assets/diamonds/${diamondSrcImageChosen}.png`;
  }

  #pickRandomDiamondSrcImage() {
    this.#diamondSrcImage = this.#getRandomDiamondImage();
  }

  checkWinCondition() {
    let unrevealedSafeBlocks = this.gameGrid.filter(
      (block) => !block.hasBomb && !block.revealed
    ).length;
    if (unrevealedSafeBlocks === 0) {
      this.revealAllBlocks();
      alert("Parabéns! Você ganhou!");
      this.resetRound();
    }
  }

  placeBombs() {
    let bombsPlaced = 0;
    console.log("------------ Onde as bombas estão plantadas ------------ ");
    while (bombsPlaced < this.#bombCount) {
      const randomIndex = Math.floor(Math.random() * this.gameGrid.length);
      if (!this.gameGrid[randomIndex].hasBomb) {
        console.log(this.gameGrid[randomIndex]);

        this.gameGrid[randomIndex].hasBomb = true;
        bombsPlaced++;
      }
    }
  }

  loadingNewRound() {}

  startNewRound() {
    this.#setInitialDiamonds();
    this.#pickRandomDiamondSrcImage();
    this.createGrid();
  }

  resetRound() {
    for (let i = 0; i < this.#gridSize; i++) {
      for (let j = 0; j < this.#gridSize; j++) {
        const block = document.querySelector(
          `.mine-block[data-x='${i}'][data-y='${j}']`
        );
        // limpar os eventos
        block.removeEventListener("click", this.handleBlockClick);
      }
    }

    this.#gridEl.innerHTML = "";
    this.gameGrid = [];
    this.startNewRound();
  }
}
