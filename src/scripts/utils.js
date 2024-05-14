console.log(
  "%cBrendon desenvolveu isso. ☕",
  [
    "color: #ED1836;",
    "font-size: 16px;",
    "font-weight: bold;",
    "padding: 10px 16px;",
    "background-color: #0f1923;",
    "border-radius: 8px;",
    "border: 1px solid #333",
  ].join("")
);

/**
 * Retorna a data atual formatada conforme o fuso horário "pt-BR".
 * @param {Date} date - O objeto Date que representa a data.
 * @returns {string} Retorna a data atual formatada como uma string no formato local, com o fuso horário configurado para "pt-BR".
 */
function formatDateToBrazilianFormat(date) {
  return date.toLocaleString("pt-BR", { timezone: "UTC" });
}

/**
 * Verifica se o valor fornecido é do tipo booleano.
 * @param {any} b - O valor a ser verificado.
 * @returns {boolean} Retorna true se o valor fornecido for do tipo booleano, caso contrário, retorna false.
 */
const isBoolean = (b) => (typeof b == "boolean" ? true : false);

/**
 * Verifica se um elemento existe, ou seja, se não é nulo ou indefinido.
 * @param {HTMLElement | null} el - O elemento a ser verificado.
 * @returns {boolean} Retorna true se o elemento existir (não for nulo ou indefinido), caso contrário, retorna false.
 */
const elementExists = (el) => el != null;

/**
 * Retorna um número aleatório entre 0 (inclusive) e o valor máximo fornecido (exclusive) sendo um número inteiro.
 * @param {number} max - O valor máximo (exclusive) a partir do qual o número aleatório será gerado.
 * @returns {number} Retorna um número aleatório entre 0 (inclusive) e o valor máximo fornecido (exclusive) sendo um número inteiro.
 */
function getRandomInt(max) {
  const randomNumber = Math.random() * max;
  return Math.floor(randomNumber);
}

/**
 * Arredonda um número de ponto flutuante para duas casas decimais.
 * @param {number} numero - O número a ser arredondado.
 * @returns {number} Um número com apenas duas casas decimais.
 */
function roundToTwoDecimalPlaces(number) {
  return Math.round(number * 100) / 100;
}

/**
 * Exibe um alerta na janela do navegador para o usuário com uma mensagem e registra no log de desenvolvedor.
 * @param {string} message A mensagem a ser exibida no alerta.
 */
function showAlert(message) {
  log("alert", message);
  window.alert(message);
}

const VALID_BET_STATUS = ["bet", "cancel", "cash-out"];
/**
 * Verifica se o status da aposta é válido, podendo ser apenas "bet", "cancel" ou "cash-out".
 * @param {string} betStatus - O status da aposta do fieldset que vem do atributo 'data-bet-status' definido no fieldset.
 * @returns {boolean} Retorna true se o status for válido, caso contrário, retorna false.
 */
function isBetStatusValid(betStatus) {
  return VALID_BET_STATUS.includes(betStatus);
}

/**
 * Função que aguarda a quantidade especificada de milissegundos antes de resolver a promessa.
 * Útil para usar com `async` e `await` fazendo com que o programa espere antes de seguir a própria instrução.
 * @param {number} ms - O número de milissegundos a aguardar.
 * @returns {Promise<void>} - Uma promessa que será resolvida após o tempo especificado.
 */
async function sleep(ms) {
  log("sleep", `Esperando ${parseFloat(ms / 1000).toFixed(2)} segundos`);

  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Função responsável por exibir uma mensagem informativa, de alerta ou executar uma operação de espera ou armazenamento.
 * @typedef {("info"|"alert"|"sleep"|"storage"|"start"|"round"|"block"|"event")} ActionType
 */

const LOG_COLORS = {
  info: "#3498db", // azul
  alert: "#e67e22", // laranja
  sleep: "#b07cc6", // roxo
  storage: "#2ecc71", // verde
  start: "#f1c40f", // amarelo
  block: "#ef4444", // vermelho
  event: "#629a90", // verde musgo
};

/**
 * Função utilitária apenas para mostrar a mensagem no console de desenvolvedor.
 * @param {ActionType} type - O tipo da mensagem.
 * @param {string} message - A mensagem a ser registrada.
 */
function log(type, message) {
  const color = LOG_COLORS[type] || "#6789ab"; // cor padrão é cinza
  console.log(
    `%c[${type}]`,
    `color: ${color}; background-color: #111; padding: 2px; border-radius: 2px;`,
    `- ${message}`
  );
  // console.log(`[${type}] - ${message}`);
}

/**
 * Enumeração para mapear as mensagens de ajuda exibidas que auxilia o entendimento do jogador sobre o jogo.
 * @enum {string}
 */
const BET_HINT_MESSAGES = {
  /** Mensagem exibida quando o usuário pode fazer uma aposta. */
  userCanBet: "Faça a sua aposta abaixo",
  /** Mensagem exibida quando o usuário clicou no botão que contêm uma mina */
  userLose: "Você perdeu!",
  /** Mensagem exibida quando o usuário precisa esperar uma nova rodada para apostar.*/
  userCanPlay: "Clique em um dos blocos para jogar",
};

const DIAMONDS_IMAGE_FILENAMES = [
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

export {
  formatDateToBrazilianFormat,
  getRandomInt,
  showAlert,
  isBoolean,
  elementExists,
  isBetStatusValid,
  roundToTwoDecimalPlaces,
  sleep,
  log,
  DIAMONDS_IMAGE_FILENAMES,
  BET_HINT_MESSAGES,
};
