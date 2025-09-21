// Detect which game
const params = new URLSearchParams(window.location.search);
const game = params.get("game");
const title = document.getElementById("gameTitle");
const board = document.getElementById("gameBoard");
const status = document.getElementById("status");

// Rule-based Tic Tac Toe
async function setupTicTacToe() {
  title.textContent = "Tic Tac Toe";
  let cells = Array(9).fill(null);
  let turn = "X";
  // Hardcoded rules object to remove dependency on external file
  const rules = {
    combos: [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ],
    rules: ["win_move", "block_move", "take_center", "take_corner", "take_side", "random_move"]
  };
  status.textContent = "Your turn (X)";

  board.innerHTML = "";
  board.style.display = "grid";
  board.style.gridTemplateColumns = "repeat(3, 100px)";
  board.style.gap = "5px";

  cells.forEach((_, i) => {
    let cell = document.createElement("div");
    cell.style.width = "100px";
    cell.style.height = "100px";
    cell.style.background = "#fff";
    cell.style.borderRadius = "12px";
    cell.style.display = "flex";
    cell.style.alignItems = "center";
    cell.style.justifyContent = "center";
    cell.style.fontSize = "2rem";
    cell.style.cursor = "pointer";
    cell.addEventListener("click", () => {
      if (turn === "X" && !cells[i] && !checkWin(cells, "X") && !checkWin(cells, "O") && !isDraw(cells)) {
        cells[i] = turn;
        cell.textContent = turn;
        if (checkWin(cells, turn)) {
          status.textContent = `${turn} wins!`;
        } else if (isDraw(cells)) {
          status.textContent = "It's a draw!";
        } else {
          turn = "O";
          status.textContent = "AI's turn (O)...";
          setTimeout(() => aiMove(cells, rules), 500);
        }
      }
    });
    board.appendChild(cell);
  });

  function aiMove(cells, rules) {
    let move = bestMoveTicTacToe(cells, rules);
    if (move !== null) {
      cells[move] = "O";
      board.children[move].textContent = "O";
      if (checkWin(cells, "O")) {
        status.textContent = "O wins!";
      } else if (isDraw(cells)) {
        status.textContent = "It's a draw!";
      } else {
        turn = "X";
        status.textContent = "Your turn (X)";
      }
    }
  }

  function bestMoveTicTacToe(cells, rules) {
    const combos = rules.combos;

    // Rule 1: Win
    for (let [a, b, c] of combos) {
      if (cells[a] === "O" && cells[b] === "O" && !cells[c]) return c;
      if (cells[a] === "O" && cells[c] === "O" && !cells[b]) return b;
      if (cells[b] === "O" && cells[c] === "O" && !cells[a]) return a;
    }

    // Rule 2: Block
    for (let [a, b, c] of combos) {
      if (cells[a] === "X" && cells[b] === "X" && !cells[c]) return c;
      if (cells[a] === "X" && cells[c] === "X" && !cells[b]) return b;
      if (cells[b] === "X" && cells[c] === "X" && !cells[a]) return a;
    }

    // Rule 3: Take center
    if (!cells[4]) return 4;

    // Rule 4: Take corner
    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
      if (!cells[corner]) return corner;
    }

    // Rule 5: Take side
    const sides = [1, 3, 5, 7];
    for (const side of sides) {
      if (!cells[side]) return side;
    }

    // Rule 6: Random empty spot
    const empty = cells.map((v, i) => v === null ? i : null).filter(v => v !== null);
    return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
  }

  function isDraw(cells) {
    return cells.every(cell => cell !== null);
  }

  function checkWin(cells, player) {
    return [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
      .some(([a, b, c]) => cells[a] === player && cells[b] === player && cells[c] === player);
  }
}

// Rule-based Dots and Boxes
async function setupDots() {
  title.textContent = "Dots and Boxes";
  const gridSize = 4;
  const numLines = (gridSize * (gridSize - 1) * 2);
  let lines = Array(numLines).fill(null);
  let turn = "X";
  let scores = { "X": 0, "O": 0 };
  let boxes = Array((gridSize - 1) ** 2).fill(null);
  // Hardcoded rules to remove dependency on external file
  const rules = {
    rules: ["complete_box", "safe_move", "losing_move", "random_move"]
  };
  status.textContent = `Your turn (X). Score: X: ${scores.X}, O: ${scores.O}`;

  board.innerHTML = "";
  board.style.display = "grid";
  board.style.gridTemplateColumns = `repeat(${gridSize * 2 - 1}, auto)`;
  board.style.gap = "0px";
  board.style.margin = "20px auto";

  // Create grid
  for (let i = 0; i < (gridSize * 2 - 1) ** 2; i++) {
    const row = Math.floor(i / (gridSize * 2 - 1));
    const col = i % (gridSize * 2 - 1);
    const isDot = row % 2 === 0 && col % 2 === 0;
    const isHorizontalLine = row % 2 === 0 && col % 2 !== 0;
    const isVerticalLine = row % 2 !== 0 && col % 2 === 0;
    const isBox = row % 2 !== 0 && col % 2 !== 0;

    const cell = document.createElement("div");

    if (isDot) {
      cell.className = "dot";
      cell.style.width = "10px";
      cell.style.height = "10px";
      cell.style.background = "#364f6b";
      cell.style.borderRadius = "50%";
      cell.style.margin = "5px";
    } else if (isHorizontalLine) {
      cell.className = "line horizontal";
      cell.dataset.index = getLineIndex(i, gridSize, "h");
      cell.style.width = "40px";
      cell.style.height = "10px";
      cell.style.cursor = "pointer";
      cell.addEventListener("click", () => handleLineClick(cell, i, "h"));
    } else if (isVerticalLine) {
      cell.className = "line vertical";
      cell.dataset.index = getLineIndex(i, gridSize, "v");
      cell.style.width = "10px";
      cell.style.height = "40px";
      cell.style.cursor = "pointer";
      cell.addEventListener("click", () => handleLineClick(cell, i, "v"));
    } else if (isBox) {
      cell.className = "box";
      cell.dataset.index = getBoxIndex(i, gridSize);
      cell.style.width = "40px";
      cell.style.height = "40px";
      cell.style.background = "#f0f0f0";
      cell.style.display = "flex";
      cell.style.alignItems = "center";
      cell.style.justifyContent = "center";
      cell.style.fontSize = "1.5rem";
      cell.style.color = "#fff";
    }
    board.appendChild(cell);
  }

  function handleLineClick(cell, cellIndex, orientation) {
    const lineIndex = parseInt(cell.dataset.index);
    if (lines[lineIndex] === null && turn === "X") {
      lines[lineIndex] = turn;
      cell.style.background = "#364f6b";
      const boxClosed = updateBoxes(lineIndex, turn);
      
      if (!boxClosed) {
        turn = "O";
        status.textContent = `AI's turn (O)... Score: X: ${scores.X}, O: ${scores.O}`;
        setTimeout(() => aiMoveDots(lines, rules), 500);
      } else {
        status.textContent = `Your turn (X). Score: X: ${scores.X}, O: ${scores.O}`;
      }
    }
  }

  function getLineIndex(cellIndex, size, orientation) {
    const row = Math.floor(cellIndex / (size * 2 - 1));
    const col = cellIndex % (size * 2 - 1);
    if (orientation === "h") {
      return (row / 2) * (size - 1) + (col - 1) / 2;
    } else {
      const hLines = size * (size - 1);
      return hLines + ((row - 1) / 2) * size + col / 2;
    }
  }

  function getBoxIndex(cellIndex, size) {
    const row = Math.floor(cellIndex / (size * 2 - 1));
    const col = cellIndex % (size * 2 - 1);
    const boxRow = (row - 1) / 2;
    const boxCol = (col - 1) / 2;
    return boxRow * (size - 1) + boxCol;
  }

  function updateBoxes(lineIndex, player) {
    let boxClosed = false;
    const relatedBoxes = findRelatedBoxes(lineIndex, gridSize);
    relatedBoxes.forEach(boxIndex => {
      const sides = getBoxSides(boxIndex, gridSize);
      if (sides.every(side => lines[side] !== null)) {
        if (boxes[boxIndex] === null) {
          boxes[boxIndex] = player;
          scores[player]++;
          const boxGridIndex = getBoxGridIndex(boxIndex, gridSize);
          board.children[boxGridIndex].textContent = player;
          board.children[boxGridIndex].style.background = player === "X" ? "#3fc1c9" : "#c8d5b9";
          boxClosed = true;
          status.textContent = `Score: X: ${scores.X}, O: ${scores.O}`;
          if (scores.X + scores.O === (gridSize - 1) ** 2) {
            status.textContent = scores.X > scores.O ? "X wins!" : scores.O > scores.X ? "O wins!" : "It's a draw!";
          }
        }
      }
    });
    return boxClosed;
  }

  function findRelatedBoxes(lineIndex, size) {
    const hLines = size * (size - 1);
    const boxes = [];
    if (lineIndex < hLines) {
      const row = Math.floor(lineIndex / (size - 1));
      const col = lineIndex % (size - 1);
      if (row > 0) boxes.push((row - 1) * (size - 1) + col);
      if (row < size - 1) boxes.push(row * (size - 1) + col);
    } else {
      const vIndex = lineIndex - hLines;
      const row = Math.floor(vIndex / size);
      const col = vIndex % size;
      if (col > 0) boxes.push(row * (size - 1) + (col - 1));
      if (col < size - 1) boxes.push(row * (size - 1) + col);
    }
    return boxes.filter(b => b >= 0 && b < (size - 1) ** 2);
  }

  function getBoxSides(boxIndex, size) {
    const boxRow = Math.floor(boxIndex / (size - 1));
    const boxCol = boxIndex % (size - 1);
    const hLines = size * (size - 1);
    return [
      boxRow * (size - 1) + boxCol,
      (boxRow + 1) * (size - 1) + boxCol,
      hLines + boxRow * size + boxCol,
      hLines + boxRow * size + boxCol + 1
    ];
  }

  function getBoxGridIndex(boxIndex, size) {
    const boxRow = Math.floor(boxIndex / (size - 1));
    const boxCol = boxIndex % (size - 1);
    return (boxRow * 2 + 1) * (size * 2 - 1) + (boxCol * 2 + 1);
  }

  function aiMoveDots(lines, rules) {
    let move = bestMoveDots(lines, rules);
    if (move !== null) {
      lines[move] = "O";
      const lineCell = board.querySelector(`[data-index='${move}'].line`);
      if (lineCell) {
        lineCell.style.background = "#364f6b";
      }
      const boxClosed = updateBoxes(move, "O");
      if (!boxClosed) {
        turn = "X";
        status.textContent = `Your turn (X). Score: X: ${scores.X}, O: ${scores.O}`;
      } else {
        setTimeout(() => aiMoveDots(lines, rules), 500);
      }
    }
  }

  function bestMoveDots(lines, rules) {
    const emptyLines = lines.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    
    // Rule 1: Complete a box
    for (const emptyLineIndex of emptyLines) {
      const relatedBoxes = findRelatedBoxes(emptyLineIndex, gridSize);
      for (const boxIndex of relatedBoxes) {
        const sides = getBoxSides(boxIndex, gridSize);
        const filledSidesCount = sides.filter(side => lines[side] !== null).length;
        if (filledSidesCount === 3) {
          return emptyLineIndex;
        }
      }
    }

    // Rule 2: Safe move (a line that doesn't create a box with 3 sides for opponent)
    const safeMoves = emptyLines.filter(emptyLineIndex => {
      const relatedBoxes = findRelatedBoxes(emptyLineIndex, gridSize);
      return relatedBoxes.every(boxIndex => {
        const sides = getBoxSides(boxIndex, gridSize);
        const filledSidesCount = sides.filter(side => lines[side] !== null).length;
        return filledSidesCount < 2;
      });
    });

    if (safeMoves.length > 0) {
      return safeMoves[Math.floor(Math.random() * safeMoves.length)];
    }

    // Rule 3: Pick a move that creates a box with 2 sides (as a fallback before a losing move)
    const losingMoves = emptyLines.filter(emptyLineIndex => {
      const relatedBoxes = findRelatedBoxes(emptyLineIndex, gridSize);
      return relatedBoxes.some(boxIndex => {
        const sides = getBoxSides(boxIndex, gridSize);
        const filledSidesCount = sides.filter(side => lines[side] !== null).length;
        return filledSidesCount >= 2;
      });
    });

    if (losingMoves.length > 0) {
      return losingMoves[Math.floor(Math.random() * losingMoves.length)];
    }

    // Rule 4: Random move (if no other rule applies)
    return emptyLines.length ? emptyLines[Math.floor(Math.random() * emptyLines.length)] : null;
  }
}

// Run
if (game === "tictactoe") setupTicTacToe();
if (game === "dots") setupDots();
