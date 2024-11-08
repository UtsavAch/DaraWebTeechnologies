document.addEventListener("DOMContentLoaded", (event) => {

  const leaderboardButton = document.getElementById("leaderboard-btn");
  const closeLeaderboardButton = document.getElementById("close-leaderboard-btn");
  const leaderboardContainer = document.getElementById("leaderboard-container");



  const startSingleplayerButton = document.getElementById(
    "start-singleplayer-btn"
  );
  const startMultiplayerButton = document.getElementById(
    "start-multiplayer-btn"
  );
  const closeGameButton = document.getElementById("close-game-btn");
  const overlayCancelButton = document.getElementById("overlay-cancel-btn");
  const overlayConfirmButton = document.getElementById("overlay-confirm-btn");
  const helpButton = document.getElementById("help-btn");
  const closeHelpButton = document.getElementById("close-help-btn");

  const gameContainer = document.getElementById("game-container");
  const boardContainer = document.getElementById("board-container");
  const boardButtonsContainer = document.getElementById("board-btns-container");
  const playersContainer = document.getElementById("players-container");
  const confirmExitContainer = document.getElementById(
    "confirm-exit-container"
  );
  const helpOverlay = document.getElementById("help-container");


  // Display leaderboard header (no data yet)
  leaderboardButton.addEventListener("click", () => {
    leaderboardContainer.style.display = "block"; // Show leaderboard
  });

  // Close leaderboard when the close button is clicked
  closeLeaderboardButton.addEventListener("click", () => {
    leaderboardContainer.style.display = "none"; // Hide leaderboard
  });

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

  helpButton.addEventListener("click", () => {
    helpOverlay.style.display = "block";
  });

  closeHelpButton.addEventListener("click", () => {
    helpOverlay.style.display = "none";
  });
});
