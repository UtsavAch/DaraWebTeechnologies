document.addEventListener("DOMContentLoaded", (event) => {
  const startSingleplayerButton = document.getElementById(
    "start-singleplayer-btn"
  );
  const startMultiplayerButton = document.getElementById(
    "start-multiplayer-btn"
  );
  const closeGameButton = document.getElementById("close-game-btn");
  const overlayCancelButton = document.getElementById("overlay-cancel-btn");
  const overlayConfirmButton = document.getElementById("overlay-confirm-btn");

  const gameContainer = document.getElementById("game-container");
  const boardContainer = document.getElementById("board-container");
  const boardButtonsContainer = document.getElementById("board-btns-container");
  const playersContainer = document.getElementById("players-container");
  const confirmExitContainer = document.getElementById(
    "confirm-exit-container"
  );

  startSingleplayerButton.addEventListener("click", () => {
    console.log("Start button clicked");
    gameContainer.style.display = "none";
    boardContainer.style.display = "block";
    playersContainer.style.display = "block";
    boardButtonsContainer.style.display = "flex";
  });

  startMultiplayerButton.addEventListener("click", () => {
    console.log("Start button clicked");
    gameContainer.style.display = "none";
    boardContainer.style.display = "block";
    playersContainer.style.display = "block";
    boardButtonsContainer.style.display = "flex";
  });

  closeGameButton.addEventListener("click", () => {
    confirmExitContainer.style.display = "flex";
  });

  overlayCancelButton.addEventListener("click", () => {
    confirmExitContainer.style.display = "none";
  });

  overlayConfirmButton.addEventListener("click", () => {
    confirmExitContainer.style.display = "none";
    boardContainer.style.display = "none";
    gameContainer.style.display = "flex";
    playersContainer.style.display = "none";
    boardButtonsContainer.style.display = "none";
  });
});
