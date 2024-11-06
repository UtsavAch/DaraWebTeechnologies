const boardDimension = 4;

const rows = boardDimension * 2 + 1;
const cols = boardDimension * 2 + 1;
const table = document.getElementById("myTable");
const usefulCells = [];

const centralRow = Math.ceil(rows / 2);
const centralCol = Math.ceil(cols / 2);

for (let i = 1; i <= rows; i++) {
  let row = document.createElement("tr");

  for (let j = 1; j <= cols; j++) {
    let cell = document.createElement("td");
    cell.className = "cell";
    cell.id = `cell-${i}-${j}`;

    let cellDiv = document.createElement("div");
    cellDiv.className = "cell-div";

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

//////////////////////////////////////
const board = [];
for (let i = 0; i < boardDimension; i++) {
  board[i] = [];
  for (let j = 0; j < 8; j++) {
    board[i][j] = "e"; //Can be e(empty), p1(player1), p2(player3)
  }
}
console.log(board);

////
noOfPiecesP1 = 3 * boardDimension;
noOfPiecesP2 = 3 * boardDimension;

const playerOnePiecesContainer = document.getElementById(
  "player-one-pieces-container"
);
const playerTwoPiecesContainer = document.getElementById(
  "player-two-pieces-container"
);

for (let i = 1; i <= 3 * boardDimension; i++) {
  const piece1 = document.createElement("span");
  const piece2 = document.createElement("span");
  piece1.id = `p1_${i}`;
  piece2.id = `p2_${i}`;
  piece1.classList.add("piece", "piece_p1");
  piece2.classList.add("piece", "piece_p2");
  playerOnePiecesContainer.appendChild(piece1);
  playerTwoPiecesContainer.appendChild(piece2);
}

console.log(noOfPiecesP1);
console.log(noOfPiecesP2);

console.log("Useful Cells (excluding central):", usefulCells);
