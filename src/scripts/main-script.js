import { Round } from "./classes/round.js";
const grid = document.getElementById("grid");
const diamondsTextEl = document.getElementById("diamonds-quantity");

const round = new Round(grid, diamondsTextEl);
round.startNewRound();
