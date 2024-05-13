import { Player } from "./player.js";
import { GameGrid } from "./game-grid.js";

/**
 * Classe que representa uma instância do jogo.
 * @class
 */
export class Game {
  /**
   * Regras gerais ddo jogo
   */
  static RULES = {
    MINIMUM_VALUE_TO_BET: 1,
  };

  /**
   * Instância do jogador.
   * @type {Player}
   * @private
   */
  #player;

  #gameGrid;

  /**
   * Cria uma nova instância de Game.
   * @param {Player} player - Instância do jogador.
   * @param {GameGrid} gameGrid - Instância do gráfico.
   */
  constructor(player, gameGrid) {
    //injeção de dependência
    this.#player = player;
    this.#gameGrid = gameGrid;
  }

  /**
   * Constrói o jogo inicializando os elementos necessários.
   */
  build() {
    this.#gameGrid.build();
    // Carrega o dinheiro do jogador do localStorage
    this.#player.loadMoneyFromStorage();
    // Atualiza a interface do usuário com o dinheiro do jogador
    this.#player.updateMoneyOnInterface();
  }

  /**
   * Inicializa o jogo em um loop infinito.
   * @param {Function} gameFunction - Função que executa o jogo.
   * @returns {Promise<void>} - Promessa que representa o processo de inicialização.
   */
  async init(gameFunction) {
    await gameFunction();
    await this.init(gameFunction);
  }
}
