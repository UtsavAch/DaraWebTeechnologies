export const boardDimension = {
  dimension: 3,
};

export const rows = boardDimension.dimension * 2 + 1;
export const cols = boardDimension.dimension * 2 + 1;
const table = document.getElementById("myTable");
const usefulCells = [];

export const centralRow = Math.ceil(rows / 2);
export const centralCol = Math.ceil(cols / 2);

for (let i = 1; i <= rows; i++) {
  let row = document.createElement("tr");

  for (let j = 1; j <= cols; j++) {
    let cell = document.createElement("td");
    cell.className = "cell";
    cell.id = `cell-${i}-${j}`;

    let cellDiv = document.createElement("div");
    cellDiv.className = "cell-div";
    cellDiv.id = `cell-div-${i}-${j}`;

    // Identify useful cells and exclude the central cell
    if (
      (i === j || i + j === rows + 1 || i === centralRow || j === centralCol) &&
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

export const playerOnePiecesContainer = document.getElementById(
  "player-one-pieces-container"
);
export const playerTwoPiecesContainer = document.getElementById(
  "player-two-pieces-container"
);

for (let i = 1; i <= 3 * boardDimension.dimension; i++) {
  const piece1 = document.createElement("span");
  const piece2 = document.createElement("span");
  piece1.id = `p1_${i}`;
  piece2.id = `p2_${i}`;
  piece1.classList.add("piece", "piece_p1");
  piece2.classList.add("piece", "piece_p2");
  playerOnePiecesContainer.appendChild(piece1);
  playerTwoPiecesContainer.appendChild(piece2);
}
/////////
//A function to generate index matrix
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

//////////////////////////////////////
export const board = []; //Important
for (let i = 0; i < boardDimension.dimension; i++) {
  board[i] = [];
  for (let j = 0; j < 8; j++) {
    board[i][j] = "e"; //Can be e(empty), p1(player1), p2(player3)
  }
}

export const boardIndex = generateSquares(boardDimension.dimension);
