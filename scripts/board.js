let boardDimensionValue = 4; // Default value

// Function to get the current board dimension
export function getBoardDimension() {
  return boardDimensionValue;
}

// Function to set the new board dimension
export function setBoardDimension(dimension) {
  boardDimensionValue = dimension;
  console.log("New size: ", boardDimensionValue);

  updateBoard(); // Function to update the board when dimension changes
}

// Dynamic calculation for rows and columns
export function rows() {
  return boardDimensionValue * 2 + 1;
}

export function cols() {
  return boardDimensionValue * 2 + 1;
}

// Rebuild the board dynamically based on new dimension
export function updateBoard() {
  const rowsValue = rows();
  const colsValue = cols();
  console.log("Updated rows:", rowsValue, "Updated cols:", colsValue);

  // Rebuild the board here based on the new rows/cols.
  rebuildBoard(rowsValue, colsValue);

  // Redraw player pieces based on the new board dimension
  drawPlayerPieces();
}

// Function to rebuild the board table (HTML structure)
function rebuildBoard(numRows, numCols) {
  const table = document.getElementById("myTable");
  table.innerHTML = ''; // Clear the existing table content
  
  const usefulCells = [];
  const centralRow = Math.ceil(numRows / 2);
  const centralCol = Math.ceil(numCols / 2);

  // Redraw the table based on the new rows and columns
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
      if (
        (i === j || i + j === numRows + 1 || i === centralRow || j === centralCol) &&
        !(i === centralRow && j === centralCol)
      ) {
        usefulCells.push([i, j]);
        cell.classList.add("useful-cell");
      }

      cell.appendChild(cellDiv);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  // Update the board state array with empty cells
  const board = [];
  for (let i = 0; i < numRows; i++) {
    board[i] = [];
    for (let j = 0; j < numCols; j++) {
      board[i][j] = "e"; // 'e' represents an empty space
    }
  }

  console.log("Updated board state:", board);
}

// Function to draw player pieces (adjusted based on new dimension)
function drawPlayerPieces() {
  const playerOnePiecesContainer = document.getElementById("player-one-pieces-container");
  const playerTwoPiecesContainer = document.getElementById("player-two-pieces-container");

  // Clear previous pieces before redrawing them
  playerOnePiecesContainer.innerHTML = '';
  playerTwoPiecesContainer.innerHTML = '';

  // Redraw pieces based on the new board dimensions (3 pieces for each player by default)
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

// A function to generate index matrix
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
        square.push([a, j]); // Add positions for squares
      }
      square.push([n + 1, b]); // Add the last index for the square
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

// Initialize board state array with a default size of 4 (can be updated)
export const board = [];
for (let i = 0; i < rows(); i++) {
  board[i] = [];
  for (let j = 0; j < cols(); j++) {
    board[i][j] = "e"; //Can be e(empty), p1(player1), p2(player3)
  }
}

// Generate the index matrix based on the current board dimension
export const boardIndex = generateSquares(getBoardDimension());

