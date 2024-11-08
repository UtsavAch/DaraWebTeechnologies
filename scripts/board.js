const boardDimension = 4;

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
let piecesOnBoardP1 = 0; //Important (Pieces that the player1 has put on the board)
let piecesOnBoardP2 = 0; //Important (Pieces that the player2 has put on the board)

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
console.log(piecesOnBoardP1); // No. of pieces for player1
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

//Last move of the players
let lastMovePlayer1 = [];
let lastMovePlayer2 = [];

//SWITCHING BETWEEN TWO PLAYERS
document.querySelectorAll(".cell-div").forEach((cellDiv) => {
  cellDiv.addEventListener("click", () => {
    // Extract row and column from cellDiv.id
    const [, , row, col] = cellDiv.id.split("-").map(Number); // Convert row and col to numbers
    const cellPosition = [row, col];

    const [rowBoard, colBoard] = findTuplePosition(boardIndex, cellPosition);
    if (board[rowBoard][colBoard] !== "e") return; // Skip if already occupied

    // Check if the current player has pieces remaining
    if (
      (CurrentPlayer === player1 && noOfPiecesP1 > 0) ||
      (CurrentPlayer === player2 && noOfPiecesP2 > 0)
      //// FIRST PHASE LOGIC HERE
    ) {
      if (CurrentPlayer === player1) {
        cellDiv.style.backgroundColor = "#46769b";
        noOfPiecesP1 -= 1;
        piecesOnBoardP1 += 1;

        // Remove the last piece from player one's container
        const p1Pieces = document.querySelectorAll(".piece_p1");
        if (p1Pieces.length > 0) {
          playerOnePiecesContainer.removeChild(p1Pieces[p1Pieces.length - 1]);
        }

        ///Setting empty cell in the board to "p1"
        const [rowBoard, colBoard] = findTuplePosition(
          boardIndex,
          cellPosition
        );
        board[rowBoard][colBoard] = "p1";
        lastMovePlayer1 = [rowBoard, colBoard];

        //Check if the playerOne makes mill
        console.log(
          "Does playerOne makes mill? " +
            makesMill(board, "p1", lastMovePlayer1)
        );

        console.log(`Current Player: ${CurrentPlayer}`);
        console.log(`Remaining no of piece: ${noOfPiecesP1}`);
        console.log(`Pieces on board: ${piecesOnBoardP1}`);
        console.log(`Clicked Cell Position: ${cellPosition}`); // Log as tuple

        playerTwoPiecesContainer.classList.add("active-pieces-container");
        playerOnePiecesContainer.classList.remove("active-pieces-container");

        if (player2 === "computer") {
          ////IF PLAYER TWO IS A COMPUTER
          setTimeout(() => {
            console.log("This is from computer");
            const [rowBoard, colBoard] = firstPhaseMove(board, "e");
            ///Setting empty cell in the board to "p2"
            board[rowBoard][colBoard] = "p2";
            lastMovePlayer2 = [rowBoard, colBoard];

            //Check if the playerTwo makes mill
            console.log(
              "Does playerTwo makes mill? " +
                makesMill(board, "p2", lastMovePlayer2)
            );

            const cellDivPosition = boardIndex[rowBoard][colBoard];
            const cellDivId = `cell-div-${cellDivPosition[0]}-${cellDivPosition[1]}`;
            const cellDiv = document.getElementById(cellDivId);
            cellDiv.style.backgroundColor = "#bb3f3f";

            ///CODE USED BOTH FOR COMPUTER AND PLAYERTWO
            noOfPiecesP2 -= 1;
            piecesOnBoardP2 += 1;

            // Remove the last piece from player two's container
            const p2Pieces = document.querySelectorAll(".piece_p2");
            if (p2Pieces.length > 0) {
              playerTwoPiecesContainer.removeChild(
                p2Pieces[p2Pieces.length - 1]
              );
            }

            console.log(`Current Player: ${CurrentPlayer}`);
            console.log(`Remaining no of piece: ${noOfPiecesP2}`);
            console.log(`Pieces on board: ${piecesOnBoardP2}`);

            playerOnePiecesContainer.classList.add("active-pieces-container");
            playerTwoPiecesContainer.classList.remove(
              "active-pieces-container"
            );

            CurrentPlayer = player1;
          }, 500);
        }
        CurrentPlayer = player2;
      } else {
        if (player2 === "playerTwo") {
          ////IF PLAYER TWO NOT A COMPUTER
          cellDiv.style.backgroundColor = "#bb3f3f";
          console.log(`Clicked Cell Position: ${cellPosition}`); // Log as tuple

          ///CODE USED BOTH FOR COMPUTER AND PLAYERTWO
          noOfPiecesP2 -= 1;
          piecesOnBoardP2 += 1;

          // Remove the last piece from player two's container
          const p2Pieces = document.querySelectorAll(".piece_p2");
          if (p2Pieces.length > 0) {
            playerTwoPiecesContainer.removeChild(p2Pieces[p2Pieces.length - 1]);
          }

          ///Setting empty cell in the board to "p2"
          const [rowBoard, colBoard] = findTuplePosition(
            boardIndex,
            cellPosition
          );
          board[rowBoard][colBoard] = "p2";

          //Check if the playerTwo makes mill
          console.log(
            "Does playerTwo makes mill? " +
              makesMill(board, "p2", lastMovePlayer2)
          );

          console.log(`Current Player: ${CurrentPlayer}`);
          console.log(`Remaining no of piece: ${noOfPiecesP2}`);
          console.log(`Pieces on board: ${piecesOnBoardP2}`);

          playerOnePiecesContainer.classList.add("active-pieces-container");
          playerTwoPiecesContainer.classList.remove("active-pieces-container");
          CurrentPlayer = player1;
        }
      }
    } else if (
      (CurrentPlayer === player1 &&
        noOfPiecesP1 === 0 &&
        piecesOnBoardP1 > 0) ||
      (CurrentPlayer === player2 && noOfPiecesP2 === 0 && piecesOnBoardP2 > 0)
      //// SECOND PHASE LOGIC HERE
    ) {
      console.log("Phase two has started!! ");
      console.log(`${CurrentPlayer} is the current player`);
    }

    console.log(board);
  });
});

//////HELPER FUNCTIONS
function findTuplePosition(array, tuple) {
  for (let outerIndex = 0; outerIndex < array.length; outerIndex++) {
    for (
      let innerIndex = 0;
      innerIndex < array[outerIndex].length;
      innerIndex++
    ) {
      const currentTuple = array[outerIndex][innerIndex];
      if (currentTuple[0] === tuple[0] && currentTuple[1] === tuple[1]) {
        return [outerIndex, innerIndex];
      }
    }
  }
  return null;
}
