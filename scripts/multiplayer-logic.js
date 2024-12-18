import { setNotificationMessage, gameInfo } from "./config.js";
import { notify } from "../backend/server-communication-fetch.js";
import { findTuplePosition } from "../backend/helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  const waitingView = document.getElementById("waiting-view");
  const gameContainer = document.getElementById("game-container");
  const boardContainerMultiplayer = document.getElementById(
    "board-container-multiplayer"
  );

  const playerOnePiecesContainer = document.getElementById(
    "player-one-pieces-container"
  );
  const playerTwoPiecesContainer = document.getElementById(
    "player-two-pieces-container"
  );
  const leaveConfirmButton = document.getElementById("overlay-confirm-btn");
  const repalyConfirmButton = document.getElementById(
    "overlay-confirm-btn-replay"
  );

  const playersContainer = document.getElementById("players-container");
  const boardButtonsContainer = document.getElementById("board-btns-container");

  //we should check that what kind of fields the received object has before working with it -> handle when it gives back the winner bc the other user left
  window.addEventListener("playersPaired", (event) => {
    waitingView.style.display = "none";

    const receivedData = JSON.parse(event.detail);
    console.log("Parsed Data:", receivedData);

    // Create the table only once when players are paired
    createTable(receivedData); // This should only be called once

    const indexTabl = generateSquares(gameInfo.boardSize);
    console.log(receivedData.table);

    let bluePiecesOnBoard = 0;
    let redPiecesOnBoard = 0;

    for (let i = 0; i < gameInfo.boardSize; i++) {
      for (let j = 0; j < 8; j++) {
        if (receivedData.board[i][j] == "blue") {
          bluePiecesOnBoard += 1;
          let x_coord = indexTabl[i][j][0];
          let y_coord = indexTabl[i][j][1];
          document.getElementById(
            `cell-div-mult-${x_coord}-${y_coord}`
          ).style.backgroundColor = "#46769b";
        } else if (receivedData.board[i][j] == "red") {
          redPiecesOnBoard += 1;
          let x_coord = indexTabl[i][j][0];
          let y_coord = indexTabl[i][j][1];
          document.getElementById(
            `cell-div-mult-${x_coord}-${y_coord}`
          ).style.backgroundColor = "#bb3f3f";
        }
      }
    }

    // leaveConfirmButton.addEventListener("click", () => {
    //   boardContainerMultiplayer.style.display = "none";
    //   bluePiecesOnBoard = 0;
    //   redPiecesOnBoard = 0;
    // });

    const playerBlueField = Object.keys(receivedData.players)[0];
    const playerRedField = Object.keys(receivedData.players)[1];
    const playerOne = document.getElementById("player-one-name");
    playerOne.textContent = playerBlueField;
    const playerTwo = document.getElementById("player-two-name");
    playerTwo.textContent = playerRedField;

    gameContainer.style.display = "none";
    boardContainerMultiplayer.style.display = "block";
    playersContainer.style.display = "block";
    boardButtonsContainer.style.display = "flex";

    // const totalPieces = 3 * gameInfo.size;
    // const p1Pieces = document.querySelectorAll(".piece_p1");
    // playerOnePiecesContainer.removeChild(
    //   p1Pieces[totalPieces - bluePiecesOnBoard]
    // );
    // playerTwoPiecesContainer.removeChild(
    //   p1Pieces[totalPieces - bluePiecesOnBoard]
    // );
  });
});

//////////////////////////
// CREATE TABLE
//////////////////////////
const createTable = (receivedData) => {
  // Clear the existing table if any
  const existingTable = document.getElementById("myTableMultiplayer");
  if (existingTable) {
    existingTable.innerHTML = ""; // Clear all content of the existing table
  }

  // Creating a table for multiplayer
  const table = document.getElementById("myTableMultiplayer");
  const usefulCells = [];

  const dimension = gameInfo.boardSize;
  const rows = dimension * 2 + 1;
  const cols = dimension * 2 + 1;
  const centralRow = Math.ceil(rows / 2);
  const centralCol = Math.ceil(cols / 2);

  // Generate rows and columns
  for (let x = 1; x <= rows; x++) {
    const row = document.createElement("tr");

    for (let y = 1; y <= cols; y++) {
      const cell = document.createElement("td");
      cell.id = `c-${x}-${y}`; // ID of each cell
      cell.className = "cell-mult";

      let cellDiv = document.createElement("div");
      cellDiv.className = "cell-div-mult"; // Div inside the cell
      cellDiv.id = `cell-div-mult-${x}-${y}`;

      // Add to usefulCells if applicable
      if (
        (x === y ||
          x + y === rows + 1 ||
          x === centralRow ||
          y === centralCol) &&
        !(x === centralRow && y === centralCol)
      ) {
        usefulCells.push([x, y]); // Useful cells
        cell.classList.add("useful-cell-mult");
      }

      // Append the div to the cell and the cell to the row
      cell.appendChild(cellDiv);
      row.appendChild(cell);
    }

    table.appendChild(row); // Append the row to the table
    removeAllBorders(rows, cols, centralRow, centralCol); // Remove unnecessary borders
  }

  table.style.display = "block"; // Ensure the table is visible

  // Generate the index table for the board, given the dimension
  const indexTable = generateSquares(dimension);
  const board = receivedData.board;

  console.log("Index Table Mult:", indexTable); // Log the generated index table
  console.log("Board Mult:", board); // Log the board information

  // Other game logic continues...

  let player1 = Object.keys(receivedData.players)[0]; // Extract player 1 from received data
  let player2 = Object.keys(receivedData.players)[1]; // Extract player 2 from received data

  // Handle clicks on the table dynamically using event delegation
  // Handle clicks on the table dynamically using event delegation
  table.addEventListener("click", async (event) => {
    const target = event.target;

    // Ensure the clicked element is a cellDiv and not part of table re-creation
    if (target && target.classList.contains("cell-div-mult")) {
      const clickedCellId = target.id;
      const clickedCellCoord = extractCoordinates(clickedCellId);
      const clickedCellIndex = findTuplePosition(indexTable, clickedCellCoord);

      if (receivedData.turn !== gameInfo.username) {
        setNotificationMessage("It's not your turn!");
        return;
      }

      try {
        const data = await notify(
          gameInfo.username,
          gameInfo.password,
          gameInfo.gameId,
          clickedCellIndex[0],
          clickedCellIndex[1]
        );

        console.log("Response from server:", data);

        if (receivedData.winner) {
          setNotificationMessage(receivedData.winner + " won!");
          const winnerContainer = document.getElementById("winner-container");
          winnerContainer.style.display = "flex";
        }

        // Handle Drop Phase
        else if (receivedData.phase === "drop") {
          setNotificationMessage("This is the drop phase.");
          if (Object.keys(data).length === 0) {
            // receivedData.board[clickedCellIndex[0]][clickedCellIndex[1]] =
            //   gameInfo.username === player1 ? "blue" : "red";
            // receivedData.turn =
            //   gameInfo.username === player1 ? player2 : player1;
            setNotificationMessage(
              `${gameInfo.username} placed a piece at ${clickedCellIndex}`
            );
          } else {
            setNotificationMessage("Move not allowed during drop phase.");
          }
        }
        // Handle Move Phase
        else if (receivedData.phase === "move") {
          setNotificationMessage("This is the move phase.");

          if (receivedData.step === "from") {
            if (Object.keys(data).length === 0) {
              receivedData.selectedCell = clickedCellIndex;
              setNotificationMessage(
                `${gameInfo.username} selected ${clickedCellIndex} to move from.`
              );
            } else {
              setNotificationMessage("Invalid move selection.");
            }
          } else if (receivedData.step === "to") {
            if (Object.keys(data).length === 0) {
              // receivedData.board[clickedCellIndex[0]][clickedCellIndex[1]] =
              //   gameInfo.username === player1 ? "blue" : "red";
              // receivedData.turn =
              //   gameInfo.username === player1 ? player2 : player1;
              setNotificationMessage(
                `${gameInfo.username} moved to ${clickedCellIndex}.`
              );
            } else {
              setNotificationMessage("Move not allowed to the target cell.");
            }
          } else if (receivedData.step === "take") {
            if (Object.keys(data).length === 0) {
              setNotificationMessage(
                `${gameInfo.username} captured a piece at ${clickedCellIndex}.`
              );
            } else {
              setNotificationMessage("Capture not allowed.");
            }
          }
        } else {
          setNotificationMessage("Unexpected game phase.");
        }
      } catch (error) {
        console.error("Notify failed:", error.message);
        setNotificationMessage(`Something went wrong: ${error.message}`);
      }
    }
  });
};

// Extracting the coordinates from the cellDiv ID
const extractCoordinates = (cellId) => {
  const parts = cellId.split("-");
  const x = parseInt(parts[3], 10);
  const y = parseInt(parts[4], 10);
  return [x, y];
};

const generateSquares = (n) => {
  const dim = Number(n);
  const squares = [];
  const size = n * 2 + 1;

  let a = 1;
  let b = size;
  let c = dim;
  while (a <= dim) {
    for (let i = 1; i <= c; i++) {
      const square = [];
      for (let j = a; j <= b; j += c) {
        square.push([a, j]);
      }
      square.push([dim + 1, b]);
      for (let j = b; j >= a; j -= c) {
        square.push([b, j]);
      }
      square.push([dim + 1, a]);
      squares.push(square);
      a += 1;
      b -= 1;
      c -= 1;
    }
  }
  return squares;
};

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
function removeBorders(cellId, borders) {
  const cell = document.getElementById(cellId);
  if (cell) {
    if (borders.includes("top")) cell.style.borderTop = "none";
    if (borders.includes("bottom")) cell.style.borderBottom = "none";
    if (borders.includes("left")) cell.style.borderLeft = "none";
    if (borders.includes("right")) cell.style.borderRight = "none";
  }
}

function removeAllBorders(rows, cols, centralRow, centralCol) {
  //////// BOTTOM-TOP-LEFT-RIGHT
  for (let i = centralRow; i <= rows; i++) {
    let id = `c-${i}-${i}`;
    let borders = ["bottom", "top", "left", "right"];
    removeBorders(id, borders);
  }

  //////// BOTTOM-RIGHT
  for (let i = 1; i < centralRow; i++) {
    let id = `c-${i}-${i}`;
    let borders = ["bottom", "right"];
    removeBorders(id, borders);
  }

  // Remove borders for the central row (except for the central cell)
  for (let col = 1; col <= cols; col++) {
    if (col !== centralCol) {
      let id = `c-${centralRow}-${col}`;
      let borders = ["bottom", "right"];
      removeBorders(id, borders);
    }
  }

  // Remove borders for the central column (except for the central cell)
  for (let row = 1; row <= rows; row++) {
    if (row !== centralRow) {
      let id = `c-${row}-${centralCol}`;
      let borders = ["bottom", "right"];
      removeBorders(id, borders);
    }
  }

  ///////BOTTOM-LEFT-RIGHT
  for (let i = 1; i < rows; i++) {
    let id = `c-${rows}-${i}`;
    let borders = ["bottom", "left", "right"];
    removeBorders(id, borders);
  }

  {
    let a = 2;
    let b = cols;
    for (let i = 1; i < centralCol - 1; i++) {
      for (let j = a; j < b; j++) {
        if (j != centralCol) {
          let id = `c-${i}-${j}`;
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
    let id = `c-${centralRow - 1}-${centralCol}`;
    let borders = ["bottom", "left", "right"];
    removeBorders(id, borders);
  }

  {
    let a = 2;
    let b = cols - 1;
    for (let i = cols - 1; i > centralCol; i--) {
      for (let j = a; j < b; j++) {
        if (j != centralCol) {
          let id = `c-${i}-${j}`;
          let borders = ["bottom", "left", "right"];
          removeBorders(id, borders);
        }
      }
      a += 1;
      b -= 1;
    }
  }

  //////// BOTTOM-TOP-RIGHT
  for (let i = 1; i < cols; i++) {
    let id = `c-${i}-${cols}`;
    let borders = ["bottom", "top", "right"];
    removeBorders(id, borders);
  }

  {
    let a = 2;
    let b = rows;
    for (let i = 1; i < centralRow - 1; i++) {
      for (let j = a; j < b; j++) {
        if (j != centralRow) {
          let id = `c-${j}-${i}`;
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
    let id = `c-${centralRow}-${centralCol - 1}`;
    let borders = ["bottom", "top", "right"];
    removeBorders(id, borders);
  }

  {
    let a = 2;
    let b = rows - 1;
    for (let i = cols - 1; i > centralRow; i--) {
      for (let j = a; j < b; j++) {
        if (j != centralRow) {
          let id = `c-${j}-${i}`;
          let borders = ["bottom", "top", "right"];
          removeBorders(id, borders);
        }
      }
      a += 1;
      b -= 1;
    }
  }
}
