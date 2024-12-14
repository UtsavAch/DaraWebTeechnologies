import { setNotificationMessage } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const waitingView = document.getElementById("waiting-view");
  const gameContainer = document.getElementById("game-container");
  const boardContainerMultiplayer = document.getElementById(
    "board-container-multiplayer"
  );
  const playersContainer = document.getElementById("players-container");
  const boardButtonsContainer = document.getElementById("board-btns-container");

  //Creating a tables for multiplayer
  const table = document.getElementById("myTableMultiplayer");
  const dimension = 4;

  // Generate rows and columns
  for (let x = 0; x < dimension; x++) {
    const row = document.createElement("tr");

    for (let y = 0; y < dimension; y++) {
      const cell = document.createElement("td");
      cell.id = `c-${x}-${y}`;
      cell.className = "cell-mult";
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  //Generate the index table for the board, given the dimension

  //board = [nested array with p1, p2 or e]
  //board index [nested array with indexes for all boxes]

  ///Phase, 1:-
  // Player1 makes move  -> browser notifies the server -> server sends updated board -> update the UI of the board for both players -> Player 2 makes move -> browser notifies to the server  ->  server sends the updated board -> Update the board for both players -> ...
  //Phase 2:-
  //Player one selects piece -> browser notifies to the server -> server sends back the ame board -> User clicks empty field where he wants to make move -> browser notifies to the server -> server checks if it is a correct move -> If not gives error else new board -> player 2 makes move ...
  //Make resetBoard function to reset the board

  window.addEventListener("playersPaired", (event) => {
    waitingView.style.display = "none";

    const receivedData = JSON.parse(event.detail);
    console.log("Parsed Data:", receivedData);

    setNotificationMessage("Let the battle begin !");

    const playerBlueField = Object.keys(receivedData.players)[0];
    const playerRedField = Object.keys(receivedData.players)[1];
    //const dimension
    //boardDimension.dimension = parseInt(dimension);
    const playerOne = document.getElementById("player-one-name");
    playerOne.textContent = playerBlueField;
    const playerTwo = document.getElementById("player-two-name");
    playerTwo.textContent = playerRedField;

    /*const player = new Player(playerName);
        leaderboard.addPlayer(player);
        console.log("Player added:", player); //debug*/

    gameContainer.style.display = "none";
    boardContainerMultiplayer.style.display = "block";
    playersContainer.style.display = "block";
    boardButtonsContainer.style.display = "flex";
  });
});
