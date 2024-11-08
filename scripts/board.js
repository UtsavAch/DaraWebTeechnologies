let boardDimension = 3;

export const rows = boardDimension * 2 + 1;
export const cols = boardDimension * 2 + 1;
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

//////////////////////////////////////
const board = []; //Important
for (let i = 0; i < boardDimension; i++) {
  board[i] = [];
  for (let j = 0; j < 8; j++) {
    board[i][j] = "e"; //Can be e(empty), p1(player1), p2(player3)
  }
}

////
let noOfPiecesP1 = 3 * boardDimension; //Important
let noOfPiecesP2 = 3 * boardDimension; //Important

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
const boardIndex = generateSquares(boardDimension);
////////
console.log(usefulCells); // The cells from the table that are useful
console.log(board); // Board- a matrix of concentric squares, with cells filled or empty
console.log(boardIndex); // boardIndex- a matrix with index of the cells of the concentric squares
console.log(noOfPiecesP1); // No. of pieces for player1
console.log(noOfPiecesP2); // No. of pieces for player2

/////////////////////////////////////////////////////////////////
/////////// GAME LOGIC ////////////
/////////////////////////////////////////////////////////////////

//Importing moves and winner functions
import { firstPhaseMove, secondPhaseMove } from "../backend/moves.js";
import { winner, makesMill } from "../backend/winner.js";

const player1 = "playerOne";
const player2 = "computer";
// const player2 = "playerTwo";

///////CurrentPlayer
let CurrentPlayer = player1;

//SWITCHING BETWEEN TWO PLAYERS
document.querySelectorAll(".cell-div").forEach((cellDiv) => {
  cellDiv.addEventListener("click", () => {
    // Check if the cell is already occupied
    if (cellDiv.style.backgroundColor) return; // Skip if already colored

    // Set the background color based on the current player
    if (CurrentPlayer === player1) {
      cellDiv.style.backgroundColor = "#46769b";
      console.log(`Current Player: ${CurrentPlayer}`);
      console.log(`Clicked CellDiv ID: ${cellDiv.id}`);
    } else {
      cellDiv.style.backgroundColor = "#bb3f3f";
      console.log(`Current Player: ${CurrentPlayer}`);
      console.log(`Clicked CellDiv ID: ${cellDiv.id}`);
    }

    // Switch to the other player
    CurrentPlayer = CurrentPlayer === player1 ? player2 : player1;
  });
});
