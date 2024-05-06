import { GameGrid } from "./classes/game-grid.js";

const grid = document.getElementById("grid");
const diamondsTextEl = document.getElementById("diamonds-quantity");

const gameGrid = new GameGrid(grid, diamondsTextEl);
gameGrid.startNewRound();
