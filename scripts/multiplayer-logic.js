import { setNotificationMessage, gameInfo } from "./config.js";
import { notify } from "../backend/server-communication-fetch.js";
import { findTuplePosition } from "../backend/helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  const waitingView = document.getElementById("waiting-view");
  const gameContainer = document.getElementById("game-container");
  const boardContainerMultiplayer = document.getElementById(
    "board-container-multiplayer"
  );

  const playersContainer = document.getElementById("players-container");
  const boardButtonsContainer = document.getElementById("board-btns-container");

  //we should check that what kind of fields the received object has before working with it -> handle when it gives back the winner bc the other user left
  window.addEventListener("playersPaired", (event) => {
    waitingView.style.display = "none";

    const receivedData = JSON.parse(event.detail);
    console.log("Parsed Data:", receivedData);

    setNotificationMessage("Let the battle begin!");

    // Create the table only once when players are paired
    createTable(receivedData); // This should only be called once

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
  });
});

//////////////////////////
// CREATE TABLE
//////////////////////////
const createTable = (receivedData) => {
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

  ///Phase, 1:-
  // Player1 makes move  -> browser notifies the server -> server sends updated board -> update the UI of the board for both players -> Player 2 makes move -> browser notifies to the server  ->  server sends the updated board -> Update the board for both players -> ...
  //Phase 2:-
  //Player one selects piece -> browser notifies to the server -> server sends back the same board -> User clicks empty field where he wants to make move -> browser notifies to the server -> server checks if it is a correct move -> If not gives error else new board -> player 2 makes move ...
  //Make resetBoard function to reset the board

  let player1 = Object.keys(receivedData.players)[0]; // Extract player 1 from received data
  let player2 = Object.keys(receivedData.players)[1]; // Extract player 2 from received data
  let turn = receivedData.turn; // Get the current turn
  let phase = receivedData.phase; // Get the current game phase

  // Handle clicks on the table dynamically using event delegation
  table.addEventListener("click", (event) => {
    const target = event.target;

    // Check if the clicked element is a cellDiv and not a table re-creation
    if (target && target.classList.contains("cell-div-mult")) {
      let clickedCellId = target.id;
      let clickedCellCoord = extractCoordinates(clickedCellId);
      let clickedCellIndex = findTuplePosition(indexTable, clickedCellCoord);

      console.log("Cell clicked: ", clickedCellId);

      // Only handle the turn and UI update, not table creation
      if (receivedData.turn == gameInfo.username) {
        notify(
          gameInfo.username,
          gameInfo.password,
          gameInfo.gameId,
          clickedCellIndex[0],
          clickedCellIndex[1]
        )
          .then((data) => {
            console.log("Response from server:", data);
            if (Object.keys(data).length === 0) {
              receivedData.turn =
                gameInfo.username === player1 ? player2 : player1;
              console.log("Turn updated to: " + receivedData.turn);
              receivedData.board[clickedCellIndex[0]][clickedCellIndex[1]] =
                player1 ? "blue" : "red";
              target.style.backgroundColor = player1 ? "#46769b" : "#bb3f3f";
            }
            console.log(receivedData.board);
            setNotificationMessage("Notify successful");
          })
          .catch((error) => {
            console.error("Notify failed:", error.message);
            setNotificationMessage("Notify failed");
          });
      } else {
        console.log("It's not your turn");
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
