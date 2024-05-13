/**
 * Classe que representa o estado de uma aposta.
 * @class
 */
export class Bet {
  /**
   * Indica se a aposta foi realizada.
   * @type {boolean}
   */
  #hasBet;

  /**
   * O valor da aposta.
   * @type {number}
   * @private
   */
  #value;

  /**
   * O estado da aposta.
   * Os valores do estado da aposta pode ser: `wait` (em espera), `lose` (perdeu), `win` (ganhou) ou `bet` (apostado).
   * @type {"wait"|"lose"|"win"|"bet"}
   */
  #status; /* wait ou lose ou win ou bet */

  /**
   * Cria uma instância de aposta.
   * É os valores padrões da aposta
   */
  constructor() {
    this.#hasBet = false;
    this.#value = 0;
    this.#status = "wait";
  }

  /**
   * Getter que verifica se a aposta foi realizada.
   * @returns {boolean} Verdadeiro se a aposta foi realizada, falso caso contrário.
   */
  get hasBet() {
    return this.#hasBet;
  }

  /**
   * Getter para obter o valor da aposta.
   * @returns {number} O valor da aposta.
   */
  get value() {
    return this.#value;
  }

  /**
   * Getter para obterm o estado da aposta.
   * @returns {"wait" | "lose" | "win" | "bet"} O estado da aposta ("wait", "lose", "win" ou "bet").
   */
  get status() {
    return this.#status;
  }

  /**
   * Realiza uma aposta com o valor especificado.
   * @param {number} betValue - O valor da aposta a ser realizada.
   */
  toBet(betValue) {
    this.#value = betValue;
    this.#hasBet = true;
    this.#status = "bet";
  }

  /**
   * Cancela a aposta feita.
   */
  cancelBet() {
    this.#status = "wait";
    this.#value = 0;
    this.#hasBet = false;
  }

  /**
   * Define o estado da aposta como "lose" ou "perdeu".
   */
  loseBet() {
    this.#status = "lose";
    this.#hasBet = false;
  }

  /**
   * Define o estado da aposta como "win" ou "ganhou".
   */
  winBet() {
    this.#status = "win";
    this.#hasBet = false;
  }
}
