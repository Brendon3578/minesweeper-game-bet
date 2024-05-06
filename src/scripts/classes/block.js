import { log } from "../utils.js";

/**
 * Classe representando um bloco no jogo de campo minado.
 */
export class Block {
  x;
  y;
  hasBomb;
  isRevealed;

  /**
   * Cria uma instância do bloco.
   * @param {number} x - A coordenada x do bloco.
   * @param {number} y - A coordenada y do bloco.
   * @param {boolean} hasBomb - Indica se o bloco tem uma bomba.
   * @param {boolean} isRevealed - Indica se o bloco foi revelado.
   */
  constructor(x, y, hasBomb, isRevealed) {
    this.x = x;
    this.y = y;
    this.hasBomb = hasBomb;
    this.isRevealed = isRevealed;
  }

  /**
   * Registra a posição do bloco no console.
   */
  logBlockPosition() {
    log(
      "block",
      `Posição: [x(${this.x + 1}), y(${this.y + 1})] - hasBomb: ${
        this.hasBomb
      } - isRevealed: ${this.isRevealed}`
    );
  }
}
