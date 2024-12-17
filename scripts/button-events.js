import { setNotificationMessage, gameInfo } from "./config.js";
import { resetBoard } from "./game-logic.js";
import { boardDimension } from "./board.js";
import { leave, ranking } from "../backend/server-communication-fetch.js";

document.addEventListener("DOMContentLoaded", (event) => {
  const leaderboardButton = document.getElementById("leaderboard-btn");
  const leaderboardSubmitButton = document.getElementById("leaderboard-submit");
  const closeLeaderboardButton = document.getElementById(
    "close-leaderboard-btn"
  );
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const leaderboardSingleButton = document.getElementById("leaderboard-single-button");
  const leaderboardMultiButton = document.getElementById("leaderboard-multi-button");
  const leaderboardSingleplayer = document.getElementById("leaderboard-singleplayer");
  const leaderboardMultiplayer = document.getElementById("leaderboard-multiplayer");

  const startSingleplayerButton = document.getElementById(
    "start-singleplayer-btn"
  );
  /*
  const startMultiplayerButton = document.getElementById(
    "start-multiplayer-btn"
  );*/
  const closeGameButton = document.getElementById("close-game-btn");
  const overlayCancelButton = document.getElementById("overlay-cancel-btn");
  const overlayConfirmButton = document.getElementById("overlay-confirm-btn");
  const replayGameButton = document.getElementById("replay-game-btn");
  const overlayReplayCancelButton = document.getElementById(
    "overlay-cancel-btn-replay"
  );
  const overlayWinnerReplayButton = document.getElementById(
    "overlay-replay-btn-winner"
  );
  const overlayWinnerExitButton = document.getElementById(
    "overlay-exit-btn-winner"
  );
  const overlayReplayConfirmButton = document.getElementById(
    "overlay-confirm-btn-replay"
  );
  const helpButton = document.getElementById("help-btn");
  const closeHelpButton = document.getElementById("close-help-btn");

  const gameContainer = document.getElementById("game-container");
  const boardContainer = document.getElementById("board-container");
  const boardContainerMultiplayer = document.getElementById(
    "board-container-multiplayer"
  );
  const boardButtonsContainer = document.getElementById("board-btns-container");
  const playersContainer = document.getElementById("players-container");
  const confirmExitContainer = document.getElementById(
    "confirm-exit-container"
  );
  const replayContainer = document.getElementById("replay-container");
  const winnerContainer = document.getElementById("winner-container");
  const helpOverlay = document.getElementById("help-container");

  // player management
  class Player {
    constructor(name) {
      this.name = name;
      this.totalWins = 0; // Total wins across all board sizes
      this.victoriesByBoardSize = {
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      }; // Object to store wins for each board size
    }

    // Method to add a win for a specific board size
    addWin(boardSize) {
      if (boardSize >= 2 && boardSize <= 5) {
        this.victoriesByBoardSize[boardSize]++;
        this.totalWins++;
      } else {
        console.log("Invalid board size. Must be between 2 and 5.");
      }
    }

    // Method to get the number of wins for a specific board size
    getWinsByBoardSize(boardSize) {
      if (boardSize >= 2 && boardSize <= 5) {
        return this.victoriesByBoardSize[boardSize];
      } else {
        console.log("Invalid board size. Must be between 2 and 5.");
        return 0;
      }
    }
  }

  // Leaderboard management
  class Leaderboard {
    constructor() {
      addMockDataToLocalStorage();
      this.players = JSON.parse(localStorage.getItem("players"));
      if(!this.players) {
        this.players = [];
      }
    }

    // Add a new player to the leaderboard
    addPlayer(player) {
      const existingPlayer = this.players.find((p) => p.name === player.name);

      if (existingPlayer) {
        console.log("Jogador já existe: " + player.name);
        return false;
      }

      this.players.push(player);
      console.log("Jogador adicionado: " + player.name);
      return true;
    }

    // Get the top players sorted by total wins
    getTopPlayers() {
      return this.players.sort((a, b) => b.totalWins - a.totalWins);
    }

    // Display the leaderboard
    displayLeaderboard() {
      const tableBody = document.querySelector("#leaderboard-table-single tbody");

      tableBody.innerHTML = "";

      const topPlayers = this.getTopPlayers();

      topPlayers.forEach((player) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = player.name;
        row.appendChild(nameCell);

        for (let size = 2; size <= 5; size++) {
          const winCell = document.createElement("td");
          winCell.textContent = player.victoriesByBoardSize[size];
          row.appendChild(winCell);
        }

        const totalWinsCell = document.createElement("td");
        totalWinsCell.textContent = player.totalWins;
        row.appendChild(totalWinsCell);

        tableBody.appendChild(row);
      });
    }

    displayLeaderboardMultiplayer(boardSize) {
      const tableBody = document.querySelector("#leaderboard-table tbody");
      tableBody.innerHTML = "";
      ranking(16, boardSize).then((response) => {
        response.json().then((data) => {
          const topPlayers = data.ranking;
          topPlayers.forEach((player) => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = player.nick;
            row.appendChild(nameCell);

            const gamesCell = document.createElement("td");
            gamesCell.textContent = player.games;
            row.appendChild(gamesCell);

            const totalWinsCell = document.createElement("td");
            totalWinsCell.textContent = player.victories;
            row.appendChild(totalWinsCell);

            tableBody.appendChild(row);
          });
        });
      }).catch((error) => {
        console.log("Error:", error);
        //No need to display an error message, the user will see an empty table
      });
    }
  }

  // Add mock data to local storage
  function addMockDataToLocalStorage() {
    let players = [
      {
        name: "Player 1",
        victoriesByBoardSize: {
          2: 1,
          3: 2,
          4: 3,
          5: 4,
        },
        totalWins: 10,
      },
      {
        name: "Player 2",
        victoriesByBoardSize: {
          2: 2,
          3: 3,
          4: 4,
          5: 5,
        },
        totalWins: 14,
      },
      {
        name: "Player 3",
        victoriesByBoardSize: {
          2: 3,
          3: 4,
          4: 5,
          5: 6,
        },
        totalWins: 18,
      },
    ];
    localStorage.setItem("players", JSON.stringify(players));
  }

  const leaderboard = new Leaderboard();

  // Display leaderboard header
  leaderboardButton.addEventListener("click", () => {
    leaderboardContainer.style.display = "block"; // Show leaderboard
    leaderboard.displayLeaderboard();
  });

  leaderboardSingleButton.addEventListener("click", () => {
    leaderboardSingleplayer.style.display = "block";
    leaderboardMultiplayer.style.display = "none";
    leaderboardSingleButton.classList.remove("passive-mode");
    leaderboardMultiButton.classList.add("passive-mode");
  });

  leaderboardMultiButton.addEventListener("click", () => {
    leaderboardSingleplayer.style.display = "none";
    leaderboardMultiplayer.style.display = "block";
    leaderboardSingleButton.classList.add("passive-mode");
    leaderboardMultiButton.classList.remove("passive-mode");
  });

  leaderboardSubmitButton.addEventListener("click", () => {
    let boardSize = document.getElementById("leaderboard-size").value;
    console.log("Board size:", boardSize); // Debug
    leaderboard.displayLeaderboardMultiplayer(boardSize);
  });

  // Close leaderboard when the close button is clicked
  closeLeaderboardButton.addEventListener("click", () => {
    leaderboardContainer.style.display = "none"; // Hide leaderboard
  });

  startSingleplayerButton.addEventListener("click", () => {
    console.log("Start button clicked");
    var validation = validateSinglePlayerInput();
    if (validation) {
      setNotificationMessage("Let the battle begin !");
      event.preventDefault();
      const playerName = document.getElementById("name").value;
      const dimension = document.getElementById("singleplayer-size").value;
      const difficulty = document.querySelector(
        'input[name="difficulty"]:checked'
      ).value;

      boardDimension.dimension = parseInt(dimension);
      const difficultyLevel = document.getElementById("display-difficulty");
      difficultyLevel.textContent = "Difficulty: " + difficulty;
      const playerOne = document.getElementById("player-one-name");
      playerOne.textContent = playerName;
      const computer = document.getElementById("player-two-name");
      computer.textContent = "Computer";

      const player = new Player(playerName);
      leaderboard.addPlayer(player);
      console.log("Player added:", player); //debug

      gameContainer.style.display = "none";
      boardContainer.style.display = "block";
      playersContainer.style.display = "block";
      boardButtonsContainer.style.display = "flex";
    }
  });
/*
  startMultiplayerButton.addEventListener("click", () => {
    setNotificationMessage("Let the battle begin !");
    console.log("Start button clicked");
    gameContainer.style.display = "none";
    boardContainer.style.display = "block";
    playersContainer.style.display = "block";
    boardButtonsContainer.style.display = "flex";
  });*/

  closeGameButton.addEventListener("click", () => {
    confirmExitContainer.style.display = "flex";
  });

  overlayCancelButton.addEventListener("click", () => {
    confirmExitContainer.style.display = "none";
  });

  replayGameButton.addEventListener("click", () => {
    replayContainer.style.display = "flex";
  });

  overlayReplayCancelButton.addEventListener("click", () => {
    replayContainer.style.display = "none";
  });

  overlayWinnerReplayButton.addEventListener("click", () => {
    resetBoard();
    setNotificationMessage("Get ready for a new battle :)");
    winnerContainer.style.display = "none";
  });

  overlayWinnerExitButton.addEventListener("click", () => {
    resetBoard();
    setNotificationMessage("I hope you enjoyed the game :)");
    winnerContainer.style.display = "none";
    boardContainer.style.display = "none";
    boardContainerMultiplayer.style.display = "none";
    gameContainer.style.display = "flex";
    playersContainer.style.display = "none";
    boardButtonsContainer.style.display = "none";
  });

  overlayConfirmButton.addEventListener("click", () => {
    //Should we make it different for singleplayer and multiplayer?
    leave(gameInfo.username, gameInfo.password, gameInfo.gameId).then( _response => {
      setNotificationMessage("I hope you enjoyed the game :)");
      confirmExitContainer.style.display = "none";
      boardContainer.style.display = "none";
      gameContainer.style.display = "flex";
      playersContainer.style.display = "none";
      boardButtonsContainer.style.display = "none";
    }).catch((error) => {
      setNotificationMessage("An error occurred while leaving the game");
    });

    //This belongs to single player
    resetBoard();
  });

  overlayReplayConfirmButton.addEventListener("click", () => {
    resetBoard();
    setNotificationMessage("Get ready for a new battle :)");
    replayContainer.style.display = "none";
  });

  helpButton.addEventListener("click", () => {
    helpOverlay.style.display = "block";
  });

  closeHelpButton.addEventListener("click", () => {
    helpOverlay.style.display = "none";
  });
});

function validateSinglePlayerInput() {
  var message = [];
  var player = document.getElementById("name").value;
  if (player == "") {
    message.push("Please enter player name");
    setNotificationMessage("Make sure if the form is filled correctly!!");
  }
  var size = document.getElementById("singleplayer-size").value;
  if (size < 2 || size > 5) {
    message.push("Please enter a valid board size");
    setNotificationMessage("Make sure if the form is filled correctly!!");
  }
  var easy = document.getElementById("easy");
  var medium = document.getElementById("medium");
  var hard = document.getElementById("hard");
  if (!easy.checked && !medium.checked && !hard.checked) {
    message.push("Please select a difficulty level");
    setNotificationMessage("Make sure if the form is filled correctly!!");
  }

  var error = document.getElementById("error-messages-single");

  // Clear any existing messages (it must be here where it was before was not working)
  error.innerHTML = "";

  console.log(message);
  if (message.length > 0) {
    message.forEach((element) => {
      var p = document.createElement("p");
      var text = document.createTextNode(element);
      p.appendChild(text);
      error.appendChild(p);
    });
    return false;
  }
  return true;
}
