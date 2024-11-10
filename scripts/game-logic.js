import {
  boardDimension,
  board,
  boardIndex,
  playerOnePiecesContainer,
  playerTwoPiecesContainer,
} from "./board.js";
import {
  firstPhaseMove,
  secondPhaseMove,
  canMove,
  locate,
  selectOpponentPosition,
} from "../backend/moves.js";
import { winner, makesMill } from "../backend/winner.js";
import {
  findTuplePosition,
  isPlayerInCell,
  isTupleInArray,
} from "../backend/helpers.js";

///////////////////////////////////
let noOfPiecesP1 = 3 * boardDimension; //Important
let noOfPiecesP2 = 3 * boardDimension; //Important
let piecesOnBoardP1 = 0; //Important (Pieces that the player1 has put on the board)
let piecesOnBoardP2 = 0; //Important (Pieces that the player2 has put on the board)

/////////////////////////////////////////////////////////////////
/////////// GAME LOGIC ////////////
/////////////////////////////////////////////////////////////////

//Importing moves and winner functions

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
        let makesMillP1 = makesMill(board, "p1", lastMovePlayer1);
        if (makesMillP1) {
          CurrentPlayer = player1;
          console.log("PlayerOne makes mill");

          const opponentPositionsBoard = locate(board, "p2");
          for (let i = 0; i < opponentPositionsBoard.length; i++) {
            const opponentPosition =
              boardIndex[opponentPositionsBoard[i][0]][
                opponentPositionsBoard[i][1]
              ];
            const cellDivId = `cell-div-${opponentPosition[0]}-${opponentPosition[1]}`;
            const cellDiv = document.getElementById(cellDivId);
            const handleClick = () => {
              cellDiv.style.backgroundColor = "#fff";
              board[opponentPositionsBoard[i][0]][
                opponentPositionsBoard[i][1]
              ] = "e";
              piecesOnBoardP2 -= 1;
              cellDiv.removeEventListener("click", handleClick);
            };
            cellDiv.addEventListener("click", handleClick);
          }
        }
        ///////////////////////////////////
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
          let makesMillP2 = makesMill(board, "p2", lastMovePlayer2);
          if (makesMillP2) {
            CurrentPlayer = player2;
            console.log("PlayerTwo makes mill");

            const opponentPositionsBoard = locate(board, "p1");
            for (let i = 0; i < opponentPositionsBoard.length; i++) {
              const opponentPosition =
                boardIndex[opponentPositionsBoard[i][0]][
                  opponentPositionsBoard[i][1]
                ];
              const cellDivId = `cell-div-${opponentPosition[0]}-${opponentPosition[1]}`;
              const cellDiv = document.getElementById(cellDivId);
              const handleClick = () => {
                cellDiv.style.backgroundColor = "#fff";
                board[opponentPositionsBoard[i][0]][
                  opponentPositionsBoard[i][1]
                ] = "e";
                piecesOnBoardP1 -= 1;
                cellDiv.removeEventListener("click", handleClick);
              };
              cellDiv.addEventListener("click", handleClick);
            }
          }
          ///////////////////////////////////
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

          //////////////////////
          //////////////////////////////
          //Check if playerOne makes mill
          let makesMillP1 = makesMill(board, "p1", lastMovePlayer1);
          if (makesMillP1) {
            CurrentPlayer = player1;
            console.log("PlayerOne makes mill- Second Phase");

            const opponentPositionsBoard = locate(board, "p2");
            for (let i = 0; i < opponentPositionsBoard.length; i++) {
              const opponentPosition =
                boardIndex[opponentPositionsBoard[i][0]][
                  opponentPositionsBoard[i][1]
                ];
              const cellDivId = `cell-div-${opponentPosition[0]}-${opponentPosition[1]}`;
              const cellDiv = document.getElementById(cellDivId);
              const handleClick = () => {
                cellDiv.style.backgroundColor = "#fff";
                board[opponentPositionsBoard[i][0]][
                  opponentPositionsBoard[i][1]
                ] = "e";
                piecesOnBoardP2 -= 1;
                cellDiv.removeEventListener("click", handleClick);
              };
              cellDiv.addEventListener("click", handleClick);
            }
          }
          ///////////////////////////////////
          ///Resetting canMoveInArray and lastMovePlayer1 to empty
          canMoveInArray.length = 0;
          lastMovePlayer1.length = 0;
          player1MadeMove = true;

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

            //////////////////////////////
            //Check if playerTwo makes mill
            let makesMillP2 = makesMill(board, "p2", lastMovePlayer2);
            if (makesMillP2) {
              CurrentPlayer = player2;
              console.log("PlayerTwo makes mill");

              const opponentPositionsBoard = locate(board, "p1");
              for (let i = 0; i < opponentPositionsBoard.length; i++) {
                const opponentPosition =
                  boardIndex[opponentPositionsBoard[i][0]][
                    opponentPositionsBoard[i][1]
                  ];
                const cellDivId = `cell-div-${opponentPosition[0]}-${opponentPosition[1]}`;
                const cellDiv = document.getElementById(cellDivId);
                const handleClick = () => {
                  cellDiv.style.backgroundColor = "#fff";
                  board[opponentPositionsBoard[i][0]][
                    opponentPositionsBoard[i][1]
                  ] = "e";
                  piecesOnBoardP1 -= 1;
                  cellDiv.removeEventListener("click", handleClick);
                };
                cellDiv.addEventListener("click", handleClick);
              }
            }
            ///////////////////////////////////

            ///Resetting canMoveInArray and lastMovePlayer1 to empty
            canMoveInArray.length = 0;
            lastMovePlayer2.length = 0;
            player2MadeMove = true;

            playerOnePiecesContainer.classList.add("active-pieces-container");
            playerTwoPiecesContainer.classList.remove(
              "active-pieces-container"
            );
          }

          if (player2MadeMove) {
            CurrentPlayer = player1;
          }
        }
      }
    }
    console.log(board);
  });
});
