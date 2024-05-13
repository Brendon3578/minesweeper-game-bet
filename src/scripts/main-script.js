import { GameGrid } from "./classes/game-grid.js";
import { Game } from "./classes/game.js";
import { Player } from "./classes/player.js";
import { elementExists, roundToTwoDecimalPlaces, showAlert } from "./utils.js";

// ------------------------------------[ SCRIPT DE CONFIGURAÇÃO DOS ELEMENTOS HTML ]------------------------------------

const betButtonEl = document.getElementById("bet-button");
const gridEl = document.getElementById("grid");
const diamondsTextEl = document.getElementById("diamonds-quantity");
const gameHintTextEl = document.getElementById("game-hint");
const actualMultiplerTextEl = document.querySelector("[data-multiplier-now]");
const nextMultiplerTextEl = document.querySelector("[data-multiplier-next]");
const multiplerLabelTextEl = document.querySelector("[data-multiplier-label]");
const totalWinTextEl = document.querySelector("[data-multiplier-total-value]");
const updateBetButtons = document.querySelectorAll(
  "button[data-button-update-bet]"
);
const betValueNumberInputEl = document.getElementById("bet-value");

const multiplierTextElements = {
  actualMultiplier: actualMultiplerTextEl,
  nextMultiplier: nextMultiplerTextEl,
  multiplierLabel: multiplerLabelTextEl,
  totalWin: totalWinTextEl,
};

const elements = {
  grid: gridEl,
  multiplierEls: multiplierTextElements,
  diamondsText: diamondsTextEl,
  gameHint: gameHintTextEl,
  betButton: betButtonEl,
  inputsToDisableEls: [...updateBetButtons, betValueNumberInputEl],
};

let allElementsExists = [
  gridEl,
  Object.values(multiplierTextElements),
  gameHintTextEl,
  diamondsTextEl,
  betButtonEl,
].every((el) => elementExists(el));

if (!allElementsExists)
  throw new Error(
    "Game Grid not initialized correctly! Verify if elements exists in Document. "
  );
// ------------------------------------[ SCRIPT PRINCIPAL DO JOGO ]------------------------------------

const playerMoneyTextEl = document.getElementById("player-money");
const player = new Player(playerMoneyTextEl);
const gameGrid = new GameGrid(elements, player);

const game = new Game(player, gameGrid);
game.build();

// ------------------------------------[ SCRIPT DOS BOTÕES DE ADICIONAR MAIS DINHEIRO NO INPUT ]------------------------------------
/**
 * Verifica se o valor é válido para uma aposta.
 * Um valor é considerado válido se for um número e maior ou igual a 1.
 *
 * @param {number} value - O valor da aposta  ser verificado.
 * @returns {boolean} Retorna verdadeiro se o valor for válido para apostar, caso contrário, falso.
 *
 * @example
 * // Retorna true
 * isValidValueToBet(5);
 *
 * // Retorna false
 * isValidValueToBet(0);
 */
function isValidValueToBet(value) {
  return isNaN(value) == false && value >= Game.RULES.MINIMUM_VALUE_TO_BET;
}

updateBetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let valueToUpdate = button.dataset.buttonUpdateBet;
    let inputValue = betValueNumberInputEl.value;

    if (isValidValueToBet(inputValue) == false) {
      showAlert(
        `O valor mínimo para aposta é ${Game.RULES.MINIMUM_VALUE_TO_BET}.`
      );

      betValueNumberInputEl.value = Game.RULES.MINIMUM_VALUE_TO_BET;
      return;
    }

    let newValue = 0;

    switch (valueToUpdate) {
      case "half":
        newValue = inputValue * 0.5;
        updateBetValue(newValue);
        break;
      case "double":
        newValue = inputValue * 2;
        updateBetValue(newValue);
        break;
      default:
        break;
    }
  });
});

function updateBetValue(valueToUpdate) {
  let newValue = parseFloat(valueToUpdate);
  if (isValidValueToBet(newValue) == false) {
    showAlert(
      `O valor mínimo para aposta é ${Game.RULES.MINIMUM_VALUE_TO_BET}.`
    );

    newValue = Game.RULES.MINIMUM_VALUE_TO_BET;
  }
  betValueNumberInputEl.value = roundToTwoDecimalPlaces(newValue).toFixed(2);
}

betButtonEl.addEventListener("click", () => {
  switch (player.getBet().status) {
    case "wait":
      let betValue = betValueNumberInputEl.value;
      if (!player.hasEnoughMoney(betValue)) {
        showAlert(
          "Você não possui dinheiro suficiente para fazer essa aposta!"
        );
        return;
      }
      if (betValue < Game.RULES.MINIMUM_VALUE_TO_BET) {
        let minimumValueToBet = roundToTwoDecimalPlaces(
          Game.RULES.MINIMUM_VALUE_TO_BET
        );
        betValueNumberInputEl.value = minimumValueToBet;
        showAlert(`O valor mínimo para aposta é R$ ${minimumValueToBet}!`);
        return;
      }
      player.setBetValue(betValue);
      player.loseMoney(betValue);

      gameGrid.startNewRound();
      break;
    case "bet":
      let winnedBetValue = roundToTwoDecimalPlaces(
        player.getBetValue() * gameGrid.multiplier
      );
      player.winBet();
      player.winMoney(winnedBetValue);
      showAlert(`Você ganhou R$ ${winnedBetValue}!`);
      gameGrid.resetRound();
      player.cancelBet();
      break;
    default:
      throw new Error("Something Goes Wrong.");
      break;
  }
});
