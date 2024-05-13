import { elementExists, log } from "../utils.js";
import { Bet } from "./bet.js";

/**
 * Classe que representa o jogador dentro do jogo aviator.
 *
 * Essa classe foi feita para centralizar os métodos de aposta do jogador.
 * E poder controlar o dinheiro que é utilizado dentro do jogo.
 */
export class Player {
  /**
   * @type {number} Variável privada para armazenar o dinheiro do jogador.
   */
  #money;
  /**
   * Elemento da interface do usuário para exibir o dinheiro do jogador.
   * @type { HTMLElement }
   */
  #playerMoneyTextEl;
  /**
   * Aposta feita pelo jogador.
   * @type { Bet }
   */
  #bet;

  /**
   * Construtor da classe Player.
   * Inicializa a classe de aposta do jogador e define o ID para ela.
   * E define o elemento que atualizará o dinheiro do jogador.
   */
  constructor(playerMoneyTextEl) {
    if (elementExists(playerMoneyTextEl) == false)
      throw new Error("Element to update player money don't exists!");

    this.#playerMoneyTextEl = playerMoneyTextEl;
    this.#bet = new Bet();
  }

  /**
   * Getter para obter o dinheiro do jogador.
   * @returns {number} O dinheiro do jogador.
   */
  get money() {
    return this.#money;
  }

  /**
   * Método privado para definir o dinheiro do jogador.
   * @param {number} newMoney O novo valor do dinheiro do jogador.
   * @throws {Error} Se o novo dinheiro não for um número.
   */
  #setMoney(newMoney) {
    if (isNaN(newMoney))
      throw new Error(`Money to be changed is not a number!: ${newMoney}`);

    this.#saveMoneyInStorage(newMoney);
    this.#money = newMoney;
  }

  /**
   * Método privado para salvar o dinheiro do jogador no local storage do navegador.
   * @param {number} money O dinheiro do jogador a ser salvo.
   */
  #saveMoneyInStorage(money) {
    window.localStorage.setItem(
      "player-money",
      JSON.stringify({ money: money })
    );
  }

  /**
   * Carrega o dinheiro do jogador do localStorage do navegador.
   */
  loadMoneyFromStorage() {
    let moneyObject = JSON.parse(window.localStorage.getItem("player-money"));
    if (moneyObject != null) {
      this.#setMoney(moneyObject.money);

      log("storage", "Dinheiro do jogador foi carregado do localStorage!");
      return;
    }

    this.#saveMoneyInStorage(100);
    this.#setMoney(100);
    log("storage", "Dinheiro do jogador foi definido no localStorage!");
    return;
  }

  /**
   * Adiciona dinheiro ganho ao dinheiro do jogador.
   * E atualiza a interface do usuário.
   * @param {number} winnedMoney O dinheiro ganho.
   */
  winMoney(winnedMoney) {
    this.#setMoney(this.#money + winnedMoney);
    this.updateMoneyOnInterface();
  }

  /**
   * Remove dinheiro perdido do dinheiro do jogador.
   * E atualiza a interface do usuário.
   * @param {number} lostMoney O dinheiro perdido.
   */
  loseMoney(lostMoney) {
    this.#setMoney(this.#money - lostMoney);
    this.updateMoneyOnInterface();
  }

  /**
   * Atualiza o elemento da interface visual do usuário que mostra o dinheiro do jogador.
   */
  updateMoneyOnInterface() {
    this.#playerMoneyTextEl.innerText = this.#money.toFixed(2);
  }

  /**
   * Define o valor da aposta feita do jogaor
   * @param {number} betValue O valor da aposta.
   */
  setBetValue(betValue) {
    this.#bet.toBet(betValue);
  }

  /**
   * Obtém o valor da aposta do jogaor.
   * @returns {number} O valor da aposta.
   */
  getBetValue() {
    return this.#bet.value;
  }

  /**
   * Cancela uma aposta  feita .
   */
  cancelBet() {
    this.#bet.cancelBet();
  }

  /**
   * Perde a aposta feita pelo jogador.
   */
  loseBetsDone() {
    if (this.#bet.status == "bet") {
      this.#bet.loseBet();
    }
  }

  /**
   * Obtém a aposta perdida pelo jogador.
   * @returns {Bet} a aposta perdida pelo jogador.
   */
  getLostBets() {
    return this.#bet.status == "lose" ? this.#bet : null;
  }

  /**
   * Obtém uma aposta do jogador.
   * @returns {Bet} A aposta do jogador.
   */
  getBet() {
    return this.#bet;
  }

  /**
   * Ganha a aposta feita pelo jogador.
   */
  winBet() {
    this.#bet.winBet();
  }

  hasEnoughMoney(moneyToCompare) {
    return moneyToCompare < this.money;
  }
}
