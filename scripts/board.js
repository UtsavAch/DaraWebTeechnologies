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

/////////////////////////////////////////////////////////////////
/////////// GAME LOGIC ////////////
/////////////////////////////////////////////////////////////////

//Importing moves and winner functions
import {
  firstPhaseMove,
  secondPhaseMove,
  canMove,
  selectOpponentPosition,
} from "../backend/moves.js";
import { winner, makesMill } from "../backend/winner.js";

const player1 = "playerOne";
const player2 = "computer";
// const player2 = "playerTwo";

///////CurrentPlayer
let CurrentPlayer = player1;
//////If the game is in first or second phase
let isSecondPhase = false;

//Last move of the players
let lastMovePlayer1 = [];
let lastMovePlayer2 = [];
const canMoveInArray = []; ////IMPORTANT IN SECOND PHASE

//SWITCHING BETWEEN TWO PLAYERS
document.querySelectorAll(".cell-div").forEach((cellDiv) => {
  cellDiv.addEventListener("click", () => {
    // Extract row and column from cellDiv.id
    const [, , row, col] = cellDiv.id.split("-").map(Number); // Convert row and col to numbers
    const cellPosition = [row, col];

    const [rowBoard, colBoard] = findTuplePosition(boardIndex, cellPosition);
    if (!isSecondPhase && board[rowBoard][colBoard] !== "e") return; // Skip if occupied in first phase

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

        //////////////////////////////
        //Check if playerOne makes mill
        const makesMillP1 = makesMill(board, "p1", lastMovePlayer1);
        if (makesMillP1) {
          console.log("PlayerOne makes mill");
        }
        ////////////////
        playerTwoPiecesContainer.classList.add("active-pieces-container");
        playerOnePiecesContainer.classList.remove("active-pieces-container");

        if (player2 === "computer") {
          ////IF PLAYER TWO IS A COMPUTER
          setTimeout(() => {
            const [rowBoard, colBoard] = firstPhaseMove(board, "e");
            ///Setting empty cell in the board to "p2"
            board[rowBoard][colBoard] = "p2";

            lastMovePlayer2 = [rowBoard, colBoard];

            //////////////////////////////
            //Check if playerTwo(Computer) makes mill
            const makesMillP2 = makesMill(board, "p2", lastMovePlayer2);
            if (makesMillP2) {
              setTimeout(() => {
                console.log("PlayerTwo makes mill");
                const [remRow, remCol] = selectOpponentPosition(board, "p2");
                const cellDivPosition = boardIndex[remRow][remCol];
                const cellDivId = `cell-div-${cellDivPosition[0]}-${cellDivPosition[1]}`;
                const cellDiv = document.getElementById(cellDivId);
                cellDiv.style.backgroundColor = "#fff";
                board[remRow][remCol] = "e";
                piecesOnBoardP1 -= 1;
              }, 500);
            }
            ////////////////

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

          lastMovePlayer2 = [rowBoard, colBoard];

          //////////////////////////////
          //Check if playerTwo makes mill
          const makesMillP2 = makesMill(board, "p2", lastMovePlayer2);
          if (makesMillP2) {
            console.log("PlayerTwo makes mill");
          }
          ////////////////
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
      isSecondPhase = true;
      console.log("Phase two has started!! ");
      console.log(`${CurrentPlayer} is the current player`);

      if (CurrentPlayer === player1) {
        /////SECOND PHASE LOGIC FOR PLAYER ONE
        let player1MadeMove = false;
        //Step 1: The player can only select the pieces which he can move
        const playerCanMove =
          canMove([rowBoard, colBoard], board).length > 0 &&
          isPlayerInCell(board, "p1", [rowBoard, colBoard]);

        if (playerCanMove) {
          lastMovePlayer1 = [rowBoard, colBoard];
          const moves = canMove([rowBoard, colBoard], board);
          canMoveInArray.push(...moves);
        }
        //Step 2: The player then can select the positions where he can move the selected piece
        //Step 3: Now set the position of the selected piece to "e"
        //Step 4: Set the position he moved to "p1"
        //Step 5: Check if he made a mill
        if (isTupleInArray(canMoveInArray, [rowBoard, colBoard])) {
          console.log(
            "From player1 phase two, player1 clicked:- " +
              cellPosition +
              " Board Position " +
              [rowBoard, colBoard]
          );
          const lastMovePos =
            boardIndex[lastMovePlayer1[0]][lastMovePlayer1[1]];
          const fromDiv = `cell-div-${lastMovePos[0]}-${lastMovePos[1]}`;
          const toDiv = `cell-div-${cellPosition[0]}-${cellPosition[1]}`;
          document.getElementById(fromDiv).style.backgroundColor = "#fff";
          document.getElementById(toDiv).style.backgroundColor = "#46769b";
          console.log(board);
          board[rowBoard][colBoard] = "p1";
          board[lastMovePlayer1[0]][lastMovePlayer1[1]] = "e";
          console.log("From Div " + fromDiv + " To div " + toDiv);
          ///Resetting canMoveInArray and lastMovePlayer1 to empty
          canMoveInArray.length = 0;
          lastMovePlayer1.length = 0;
          player1MadeMove = true;
          //////////////////////
          playerOnePiecesContainer.classList.remove("active-pieces-container");
          playerTwoPiecesContainer.classList.add("active-pieces-container");
        }
        if (player2 === "computer" && player1MadeMove) {
          setTimeout(() => {
            /////SECOND PHASE LOGIC FOR COMPUTER
            console.log("Now computer makes PhaseTwo move");
            let player2MadeMove = false;

            console.log(
              "Move of the computer SecondPhase " + secondPhaseMove(board, "p2")
            );
            console.log(board);

            setTimeout(() => {
              const [fromDivPos, toDivPos] = secondPhaseMove(board, "p2");
              const fromDivPosBoard = boardIndex[fromDivPos[0]][fromDivPos[1]];
              const toDivPosBoard = boardIndex[toDivPos[0]][toDivPos[1]];

              lastMovePlayer2 = [fromDivPos[0], fromDivPos[1]];

              const fromDiv = `cell-div-${fromDivPosBoard[0]}-${fromDivPosBoard[1]}`;
              const toDiv = `cell-div-${toDivPosBoard[0]}-${toDivPosBoard[1]}`;
              document.getElementById(fromDiv).style.backgroundColor = "#fff";
              document.getElementById(toDiv).style.backgroundColor = "#bb3f3f";
              board[toDivPos[0]][toDivPos[1]] = "p2";
              board[fromDivPos[0]][fromDivPos[1]] = "e";
              console.log(
                "Comp move: From Div " + fromDiv + " To div " + toDiv
              );
            }, 500);

            //////////////////////////////
            //Check if playerTwo(Computer) makes mill
            const makesMillP2 = makesMill(board, "p2", lastMovePlayer2);
            if (makesMillP2) {
              setTimeout(() => {
                console.log("PlayerTwo makes mill - phaseTwo");
                const [remRow, remCol] = selectOpponentPosition(board, "p2");
                const cellDivPosition = boardIndex[remRow][remCol];
                const cellDivId = `cell-div-${cellDivPosition[0]}-${cellDivPosition[1]}`;
                const cellDiv = document.getElementById(cellDivId);
                cellDiv.style.backgroundColor = "#fff";
                board[remRow][remCol] = "e";
                piecesOnBoardP1 -= 1;
              }, 500);
            }
            ////////////////
            lastMovePlayer2.length = 0;

            player2MadeMove = true;

            playerOnePiecesContainer.classList.add("active-pieces-container");
            playerTwoPiecesContainer.classList.remove(
              "active-pieces-container"
            );

            playerOnePiecesContainer.classList.add("active-pieces-container");
            playerTwoPiecesContainer.classList.remove(
              "active-pieces-container"
            );

            if (player2MadeMove) {
              CurrentPlayer = player1;
            }
          }, 500);
        }
        ///Only set player2 to current player if player1 has made a move
        if (player1MadeMove) {
          CurrentPlayer = player2;
        }
      } else {
        if (player2 === "playerTwo") {
          /////SECOND PHASE LOGIC FOR PLAYER TWO
          let player2MadeMove = false;

          //Step 1: The player can only select the pieces which he can move
          const playerCanMove =
            canMove([rowBoard, colBoard], board).length > 0 &&
            isPlayerInCell(board, "p2", [rowBoard, colBoard]);

          if (playerCanMove) {
            lastMovePlayer2 = [rowBoard, colBoard];
            const moves = canMove([rowBoard, colBoard], board);
            canMoveInArray.push(...moves);
          }
          //Step 2: The player then can select the positions where he can move the selected piece
          //Step 3: Now set the position of the selected piece to "e"
          //Step 4: Set the position he moved to "p1"
          //Step 5: Check if he made a mill
          if (isTupleInArray(canMoveInArray, [rowBoard, colBoard])) {
            console.log(
              "From player2 phase two, player2 clicked:- " +
                cellPosition +
                " Board Position " +
                [rowBoard, colBoard]
            );
            const lastMovePos =
              boardIndex[lastMovePlayer2[0]][lastMovePlayer2[1]];
            const fromDiv = `cell-div-${lastMovePos[0]}-${lastMovePos[1]}`;
            const toDiv = `cell-div-${cellPosition[0]}-${cellPosition[1]}`;
            document.getElementById(fromDiv).style.backgroundColor = "#fff";
            document.getElementById(toDiv).style.backgroundColor = "#bb3f3f";
            board[rowBoard][colBoard] = "p2";
            board[lastMovePlayer2[0]][lastMovePlayer2[1]] = "e";
            console.log("From Div " + fromDiv + " To div " + toDiv);
            ///Resetting canMoveInArray and lastMovePlayer1 to empty
            canMoveInArray.length = 0;
            lastMovePlayer2.length = 0;
            player2MadeMove = true;
          }

          playerOnePiecesContainer.classList.add("active-pieces-container");
          playerTwoPiecesContainer.classList.remove("active-pieces-container");

          if (player2MadeMove) {
            CurrentPlayer = player1;
          }
        }
      }
    }
    console.log(board);
  });
});

/////////////////////////////////////////////////////////////////////////
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

//Check if the provided player is in given index
function isPlayerInCell(board, player, index) {
  const [row, col] = index;

  // Ensure the index is within bounds
  if (row >= 0 && row < board.length && col >= 0 && col < board[0].length) {
    return board[row][col] === player;
  }

  // If index is out of bounds, return false
  return false;
}

//To check if a tuple is present in a given array
function isTupleInArray(array, tuple) {
  return array.some((item) => item[0] === tuple[0] && item[1] === tuple[1]);
}
