document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid");
  const size = 8; // Tamanho do campo minado
  const bombChance = 0.1; // Probabilidade de haver uma bomba em cada bloco

  let gameGrid = [];

  // Função para criar o campo minado
  function createGrid() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.dataset.x = i;
        block.dataset.y = j;
        block.addEventListener("click", handleClick);
        grid.appendChild(block);
        gameGrid.push({
          x: i,
          y: j,
          hasBomb: Math.random() < bombChance,
          revealed: false,
        });
      }
    }
  }

  // Função para verificar se o bloco clicado contém uma bomba
  function handleClick(event) {
    const block = event.target;
    const x = parseInt(block.dataset.x);
    const y = parseInt(block.dataset.y);
    const clickedBlock = gameGrid.find(
      (block) => block.x === x && block.y === y
    );

    if (clickedBlock.hasBomb) {
      block.classList.add("bomb");
      block.textContent = "💣";
      revealAllBombs();
      alert("Você perdeu! Tente novamente.");
      resetGame();
    } else {
      revealBlock(x, y);
    }
  }

  // Função para revelar o bloco clicado
  function revealBlock(x, y) {
    const block = gameGrid.find((block) => block.x === x && block.y === y);
    if (!block.revealed) {
      const blockElement = document.querySelector(
        `.block[data-x="${x}"][data-y="${y}"]`
      );
      blockElement.classList.add("revealed");
      block.revealed = true;
      if (countAdjacentBombs(x, y) === 0) {
        revealAdjacentBlocks(x, y);
      }
    }
  }

  // Função para revelar os blocos adjacentes
  function revealAdjacentBlocks(x, y) {
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i < size && j >= 0 && j < size && !(i === x && j === y)) {
          revealBlock(i, j);
        }
      }
    }
  }

  // Função para contar o número de bombas adjacentes
  function countAdjacentBombs(x, y) {
    let count = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i < size && j >= 0 && j < size && !(i === x && j === y)) {
          const adjacentBlock = gameGrid.find(
            (block) => block.x === i && block.y === j
          );
          if (adjacentBlock.hasBomb) {
            count++;
          }
        }
      }
    }
    return count;
  }

  // Função para revelar todas as bombas no final do jogo
  function revealAllBombs() {
    gameGrid.forEach((block) => {
      if (block.hasBomb) {
        const blockElement = document.querySelector(
          `.block[data-x="${block.x}"][data-y="${block.y}"]`
        );
        blockElement.classList.add("revealed");
        blockElement.textContent = "💣";
      }
    });
  }

  // Função para reiniciar o jogo
  function resetGame() {
    grid.innerHTML = "";
    gameGrid = [];
    createGrid();
  }

  createGrid();
});
