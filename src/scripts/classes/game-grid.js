import {
  BET_HINT_MESSAGES,
  DIAMONDS_IMAGE_FILENAMES,
  elementExists,
  getRandomInt,
  log,
  roundToTwoDecimalPlaces,
  showAlert,
  sleep,
} from "../utils.js";
import { Block } from "./block.js";
import { Player } from "./player.js";

/**
 * Objeto contendo referências para elementos HTML em uma página da web.
 * @typedef {Object} Elements
 * @property {HTMLElement | null} grid - Referência para um elemento HTML que representa uma grade na página.
 * @property {MultiplierElements} multiplierEls - Referências para elementos relacionados a multiplicadores do jogo.
 * @property {HTMLElement | null} diamondsText - Referência para um elemento HTML que contém texto relacionado a diamantes no jogo.
 * @property {HTMLElement | null} gameHint - Referência para um elemento HTML que fornece dicas ou instruções sobre o jogo.
 * @property {HTMLElement | null} betButton - Referência para um elemento HTML do botão que serve para fazer apostas.
 * @property {(HTMLElement | null)[]} inputsToDisableEls - Referência para os elementos do usuário que ele define o valor da aposta.
 */

/**
 * Objeto contendo referências para elementos relacionados a multiplicadores do jogo.
 * @typedef {Object} MultiplierElements
 * @property {Element | null} actualMultiplier - Referência para um elemento HTML que representa o multiplicador atual do jogo.
 * @property {Element | null} nextMultiplier - Referência para um elemento HTML que representa o próximo multiplicador do jogo.
 * @property {Element | null} multiplierLabel - Referência para um elemento HTML que contém um rótulo ou descrição para os multiplicadores.
 * @property {Element | null} totalWin - Referência para um elemento HTML que mostra o total de ganhos do jogo.
 */

export class GameGrid {
  #ROUND_LOADING_NEW_GAME_MS = 10000;

  #bombCount = 10;
  #gridSize = 6;
  #diamondsTotal = 0;
  #diamondsCount = 0;
  #diamondSrcImage = "";
  #isGameStarted = false;
  multiplier = 1;
  nextMultiplier = 1;
  diamondsClicked = 0;
  /**
   * @type {Array<Block>}
   */
  gameGrid = [];
  isGameRevealed = false;

  /**
   * @type { Elements }
   */
  #elements;

  /**
   * @type { Player }
   */
  #player;

  constructor(elements, player) {
    this.#elements = elements;
    this.#player = player;

    // precisa ter o .bind
    this.handleBlockClick = this.handleBlockClick.bind(this);
    this.enableGameGrid(false);
  }

  async handleBlockClick(event) {
    if (this.isGameRevealed) return;
    const block = event.target;
    const x = parseInt(block.dataset.x);
    const y = parseInt(block.dataset.y);

    // Verifica se o bloco clicado tem uma bomba
    let clickedBlock = this.gameGrid.find(
      (block) => block.x == x && block.y == y
    );

    if (!clickedBlock) throw new Error("Clicked Block not exists!");

    if (clickedBlock.isRevealed) return;

    clickedBlock.isRevealed = true;

    // jogador perdeu aqui
    if (clickedBlock.hasBomb) {
      block.classList.add("bomb");
      block.innerHTML = this.#createIconImgEl("bomb");

      await this.loseRound();
    } else {
      this.diamondsClicked += 1;
      this.updateMultipliers();
      this.setBetButtonToCashOut();
      this.removeOneDiamond();
      block.classList.add("diamond");
      block.classList.add("revealed");
      block.innerHTML = this.#createIconImgEl("diamond");
      // block.textContent = "💎"; // Adiciona o ícone de diamante
      this.checkWinCondition();
    }
  }

  setBetButtonToCashOut() {
    let totalBetValue = roundToTwoDecimalPlaces(
      this.multiplier * this.#player.getBetValue()
    );
    this.disableBetButton(false);
    this.setElementText(
      this.#elements.betButton,
      `Retirar R$ ${totalBetValue}`
    );
  }

  updateMultipliers() {
    let actualMultiplier =
      1 + (this.diamondsClicked / this.#diamondsTotal) * 15;
    let nextMultiplier =
      1 + ((this.diamondsClicked + 1) / this.#diamondsTotal) * 15;
    this.multiplier = actualMultiplier;
    this.nextMultiplier = nextMultiplier;
    this.updateMultiplayerTexts();
  }

  async loseRound() {
    this.setElementText(this.#elements.gameHint, BET_HINT_MESSAGES.userLose);

    this.disableBetButton(true);
    // block.textContent = "💣";
    this.revealAllBlocks();
    this.#player.loseBetsDone();

    let lostMoney = this.#player.getLostBets().value * this.multiplier;

    alert(
      `Você perdeu R$ ${roundToTwoDecimalPlaces(lostMoney)}! Tente novamente.`
    );
    this.#player.loseMoney(lostMoney);

    // --- Reniciar o jogo
    await sleep(this.#ROUND_LOADING_NEW_GAME_MS);
    this.setElementText(this.#elements.gameHint, BET_HINT_MESSAGES.userCanBet);

    this.enableGameGrid(false);
    this.isGameRevealed = false;
    this.resetRound();
    this.#player.cancelBet();
  }

  #createIconImgEl(icon) {
    let iconImageSrc;

    if (icon == "bomb") {
      iconImageSrc = "./assets/bomb.png";
    } else if (icon == "diamond") {
      iconImageSrc = this.#diamondSrcImage;
    }

    return `<img src='${iconImageSrc}' class='size-16 pointer-events-none' alt='${icon}'/>`;
  }

  revealAllBlocks() {
    this.isGameRevealed = true;

    this.gameGrid.forEach((block) => {
      console.log(block.isRevealed);
      // console.log(block);
      const blockElement = document.querySelector(
        `.mine-block[data-x="${block.x}"][data-y="${block.y}"]`
      );
      if (block.hasBomb) {
        blockElement.classList.add("bomb");
        blockElement.innerHTML = this.#createIconImgEl("bomb");
        // blockElement.textContent = "💣";
      } else {
        blockElement.classList.add("revealed");
        if (block.isRevealed == false) {
          blockElement.classList.add("ended");
        }
        blockElement.innerHTML = this.#createIconImgEl("diamond");
      }
    });
  }

  createGrid() {
    for (let i = 0; i < this.#gridSize; i++) {
      for (let j = 0; j < this.#gridSize; j++) {
        const block = document.createElement("div");
        block.classList.add("mine-block");

        block.dataset.x = j;
        block.dataset.y = i;
        this.#elements.grid.appendChild(block);
        let mineBlock = new Block(j, i, false, false);
        this.gameGrid.push(mineBlock);

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
    this.updateDiamondsText();
  }

  #setInitialDiamonds() {
    let diamondsTotal = this.#gridSize * this.#gridSize - this.#bombCount;
    this.setDiamondsCount(diamondsTotal);
    this.#diamondsTotal = diamondsTotal;
    this.updateDiamondsText();
  }

  updateDiamondsText() {
    this.#elements.diamondsText.innerText = this.#diamondsCount;
  }

  updateMultiplayerTexts(isEmpty = false) {
    if (isEmpty) {
      Object.values(this.#elements.multiplierEls).forEach((el) => {
        el.innerHTML = "&nbsp;";
      });
      return;
    }

    this.#elements.multiplierEls.actualMultiplier.textContent = `${roundToTwoDecimalPlaces(
      this.multiplier
    )}x`;
    this.#elements.multiplierEls.nextMultiplier.textContent = `${roundToTwoDecimalPlaces(
      this.nextMultiplier
    )}x`;
    this.#elements.multiplierEls.totalWin.textContent = roundToTwoDecimalPlaces(
      this.multiplier * this.#player.getBetValue()
    );
    this.#elements.multiplierEls.multiplierLabel.textContent = `(${roundToTwoDecimalPlaces(
      this.multiplier
    )}x)`;
  }

  #getRandomDiamondImage() {
    const randomDiamondIndex = getRandomInt(DIAMONDS_IMAGE_FILENAMES.length);
    const diamondSrcImageChosen = DIAMONDS_IMAGE_FILENAMES[randomDiamondIndex];
    return `./assets/diamonds/${diamondSrcImageChosen}.png`;
  }

  #preloadDiamondImgOnCache() {
    document.querySelector("#diamond-cache .diamond").innerHTML =
      this.#createIconImgEl("diamond");
    document
      .querySelectorAll("[data-diamond-img]")
      .forEach((el) => el.setAttribute("src", this.#diamondSrcImage));
  }

  #pickRandomDiamondSrcImage() {
    this.#diamondSrcImage = this.#getRandomDiamondImage();
  }

  checkWinCondition() {
    let unrevealedSafeBlocks = this.gameGrid.filter(
      (block) => !block.hasBomb && !block.isRevealed
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
        this.gameGrid[randomIndex].hasBomb = true;
        bombsPlaced++;

        this.gameGrid[randomIndex].logBlockPosition();
      }
    }
  }

  build() {
    this.#setInitialDiamonds();
    this.#pickRandomDiamondSrcImage();
    this.#preloadDiamondImgOnCache();
    this.createGrid();
    this.updateMultiplayerTexts(true);
    this.enableGameGrid(false);
    this.disableBetButton(false);
  }

  startNewRound() {
    this.disableAllUserInputs(true);
    this.disableBetButton(true);
    this.setElementText(this.#elements.gameHint, BET_HINT_MESSAGES.userCanPlay);
    this.enableGameGrid(true);
  }

  resetRound() {
    this.disableAllUserInputs(false);
    this.setElementText(this.#elements.gameHint, BET_HINT_MESSAGES.userCanBet);
    this.updateMultiplayerTexts(true);

    console.log("Validar isso aqui se funciona corretamente");

    this.gameGrid.forEach((block) => {
      const blockEl = document.querySelector(
        `.mine-block[data-x='${block.x}'][data-y='${block.y}']`
      );
      if (!elementExists(blockEl)) {
        log("block", `Block: x(${block.x}) y(${block.y})`);
        throw new Error(`Block element don't exists!`);
      }
      // limpar os eventos
      blockEl.removeEventListener("click", this.handleBlockClick);
    });

    // for (let i = 0; i < this.#gridSize; i++) {
    //   for (let j = 0; j < this.#gridSize; j++) {
    //     const block = document.querySelector(
    //       `.mine-block[data-x='${i}'][data-y='${j}']`
    //     );
    //   }
    // }

    this.#elements.grid.innerHTML = "";
    this.diamondsClicked = 0;
    this.multiplier = 1;
    this.nextMultiplier = 1;
    this.updateMultiplayerTexts();
    this.gameGrid = [];
    this.enableGameGrid(false);
    this.setElementText(this.#elements.betButton, "Apostar (Novo Jogo)");
    this.build();
  }
  enableGameGrid(shouldEnableGameGrid) {
    this.#elements.grid.dataset.disabled = !shouldEnableGameGrid;
    this.#elements.grid.classList.toggle(
      "cursor-not-allowed",
      !shouldEnableGameGrid
    );
    if (shouldEnableGameGrid) {
      this.#elements.grid.removeAttribute("title");
    } else {
      this.#elements.grid.setAttribute(
        "title",
        "Faça uma aposta antes de começar a jogar"
      );
    }
  }

  disableBetButton(shouldDisable) {
    if (shouldDisable) this.#elements.betButton.setAttribute("disabled", true);
    else this.#elements.betButton.removeAttribute("disabled");
  }

  setElementText(el, text) {
    if (!elementExists(el))
      throw new Error("Element which will text don't exists!");
    el.innerText = text;
  }

  disableAllUserInputs(shouldDisable) {
    if (shouldDisable) {
      this.#elements.inputsToDisableEls.forEach((el) => {
        el.setAttribute("disabled", true);
      });
    } else {
      this.#elements.inputsToDisableEls.forEach((el) => {
        el.removeAttribute("disabled");
      });
    }
  }

  async winRound() {
    let winnedBetValue = roundToTwoDecimalPlaces(
      this.#player.getBetValue() * this.multiplier
    );
    this.#player.winBet();
    this.#player.winMoney(winnedBetValue);
    this.revealAllBlocks();

    showAlert(`Você ganhou R$ ${winnedBetValue}!`);

    await sleep(5000);

    this.#player.cancelBet();

    this.resetRound();
  }
}
