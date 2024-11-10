// board.js

// Default board dimension
let boardDimensionValue = 4;

// Function to get the current board dimension
export function getBoardDimension() {
  return boardDimensionValue;
}

// Function to set a new board dimension and update the board
export function setBoardDimension(dimension) {
  boardDimensionValue = dimension;
  console.log("New size: ", boardDimensionValue);
  updateBoard(); // Update board based on new dimensions
}

// Dynamic calculation for rows and columns
export function rows() {
  return boardDimensionValue * 2 + 1;
}

export function cols() {
  return boardDimensionValue * 2 + 1;
}

// The board array to store the game state; 'e' represents an empty cell.
export const board = [];

// Rebuild and update the board based on the new dimensions
export function updateBoard() {
  const numRows = rows();
  const numCols = cols();
  console.log("Updated rows:", numRows, "Updated cols:", numCols);

  initializeBoardState(numRows, numCols); // Initialize board state array
  rebuildBoard(numRows, numCols);         // Build board HTML structure
  applyBorderPatterns();                  // Apply border patterns
  drawPlayerPieces();                     // Redraw player pieces
}

// Function to remove specified borders from a cell
function removeBorders(cellId, borders) {
  const cell = document.getElementById(cellId);
  if (cell) {
    if (borders.includes("top")) cell.style.borderTop = "none";
    if (borders.includes("bottom")) cell.style.borderBottom = "none";
    if (borders.includes("left")) cell.style.borderLeft = "none";
    if (borders.includes("right")) cell.style.borderRight = "none";
  }
}

// Function to create border patterns for cells
function applyBorderPatterns() {
  const centralRow = Math.ceil(rows() / 2);
  const centralCol = Math.ceil(cols() / 2);

  //////// BOTTOM-TOP-LEFT-RIGHT
for (let i = centralRow; i <= rows(); i++) {
  let id = `cell-${i}-${i}`;
  let borders = ["bottom", "top", "left", "right"];
  removeBorders(id, borders);
}

//////// BOTTOM-RIGHT
for (let i = 1; i < centralRow; i++) {
  let id = `cell-${i}-${i}`;
  let borders = ["bottom", "right"];
  removeBorders(id, borders);
}

// Remove borders for the central row (except for the central cell)
for (let col = 1; col <= cols(); col++) {
  if (col !== centralCol) {
    let id = `cell-${centralRow}-${col}`;
    let borders = ["bottom", "right"];
    removeBorders(id, borders);
  }
}

// Remove borders for the central column (except for the central cell)
for (let row = 1; row <= rows(); row++) {
  if (row !== centralRow) {
    let id = `cell-${row}-${centralCol}`;
    let borders = ["bottom", "right"];
    removeBorders(id, borders);
  }
}

///////BOTTOM-LEFT-RIGHT
for (let i = 1; i < rows(); i++) {
  let id = `cell-${rows()}-${i}`;
  let borders = ["bottom", "left", "right"];
  removeBorders(id, borders);
}

{
  let a = 2;
  let b = cols();
  for (let i = 1; i < centralCol - 1; i++) {
    for (let j = a; j < b; j++) {
      if (j != centralCol) {
        let id = `cell-${i}-${j}`;
        let borders = ["bottom", "left", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}

//Around the center
{
  let id = `cell-${centralRow - 1}-${centralCol}`;
  let borders = ["bottom", "left", "right"];
  removeBorders(id, borders);
}

{
  let a = 2;
  let b = cols() - 1;
  for (let i = cols() - 1; i > centralCol; i--) {
    for (let j = a; j < b; j++) {
      if (j != centralCol) {
        let id = `cell-${i}-${j}`;
        let borders = ["bottom", "left", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}

//////// BOTTOM-TOP-RIGHT
for (let i = 1; i < cols(); i++) {
  let id = `cell-${i}-${cols()}`;
  let borders = ["bottom", "top", "right"];
  removeBorders(id, borders);
}

{
  let a = 2;
  let b = rows();
  for (let i = 1; i < centralRow - 1; i++) {
    for (let j = a; j < b; j++) {
      if (j != centralRow) {
        let id = `cell-${j}-${i}`;
        let borders = ["bottom", "top", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}

//Around the center
{
  let id = `cell-${centralRow}-${centralCol - 1}`;
  let borders = ["bottom", "top", "right"];
  removeBorders(id, borders);
}

{
  let a = 2;
  let b = rows() - 1;
  for (let i = cols() - 1; i > centralRow; i--) {
    for (let j = a; j < b; j++) {
      if (j != centralRow) {
        let id = `cell-${j}-${i}`;
        let borders = ["bottom", "top", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}
}

// Function to build the board HTML structure
function rebuildBoard(numRows, numCols) {
  const table = document.getElementById("myTable");
  table.innerHTML = ''; // Clear previous content
  const usefulCells = [];

  for (let i = 1; i <= numRows; i++) {
    let row = document.createElement("tr");
    for (let j = 1; j <= numCols; j++) {
      let cell = document.createElement("td");
      cell.className = "cell";
      cell.id = `cell-${i}-${j}`;
      let cellDiv = document.createElement("div");
      cellDiv.className = "cell-div";
      cellDiv.id = `cell-div-${i}-${j}`;
      
      // Identify useful cells and exclude the central cell
      const centralRow = Math.ceil(numRows / 2);
      const centralCol = Math.ceil(numCols / 2);
      if ((i === j || i + j === numRows + 1 || i === centralRow || j === centralCol) &&
          !(i === centralRow && j === centralCol)) {
        usefulCells.push([i, j]);
        cell.classList.add("useful-cell");
      }

      cell.appendChild(cellDiv);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

// Initialize the board array to represent the game state
function initializeBoardState(numRows, numCols) {
  board.length = 0; // Clear existing content
  for (let i = 0; i < getBoardDimension(); i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = "e"; // 'e' represents an empty cell
    }
  }
  console.log("Updated board state:", board);
}

// Draw player pieces
function drawPlayerPieces() {
  const playerOnePiecesContainer = document.getElementById("player-one-pieces-container");
  const playerTwoPiecesContainer = document.getElementById("player-two-pieces-container");

  // Clear previous pieces
  playerOnePiecesContainer.innerHTML = '';
  playerTwoPiecesContainer.innerHTML = '';

  // Draw pieces based on the board size
  for (let i = 1; i <= 3 * boardDimensionValue; i++) {
    const piece1 = document.createElement("span");
    const piece2 = document.createElement("span");
    piece1.id = `p1_${i}`;
    piece2.id = `p2_${i}`;
    piece1.classList.add("piece", "piece_p1");
    piece2.classList.add("piece", "piece_p2");
    playerOnePiecesContainer.appendChild(piece1);
    playerTwoPiecesContainer.appendChild(piece2);
  }
}

// Generate square patterns (if needed for other patterns)
function generateSquares(n) {
  const squares = [];
  const size = n * 2 + 1;
  let a = 1;
  let b = size;
  let c = n;
  while (a <= n) {
    for (let i = 1; i <= c; i++) {
      const square = [];
      for (let j = a; j <= b; j += c) {
        square.push([a, j]);
      }
      square.push([n + 1, b]);
      for (let j = b; j >= a; j -= c) {
        square.push([b, j]);
      }
      square.push([n + 1, a]);
      squares.push(square);
      a += 1;
      b -= 1;
      c -= 1;
    }
  }
  return squares;
}

// Generate index matrix based on the board dimension
export const boardIndex = generateSquares(getBoardDimension());
