import { setNotificationMessage } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const waitingView = document.getElementById("waiting-view");
    const gameContainer = document.getElementById("game-container");
    const boardContainer = document.getElementById("board-container");
    const playersContainer = document.getElementById("players-container");
    const boardButtonsContainer = document.getElementById("board-btns-container");
    //we should check that what kind of fields the received object has before working with it -> handle when it gives back the winner bc the other user left
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
        boardContainer.style.display = "block";
        playersContainer.style.display = "block";
        boardButtonsContainer.style.display = "flex";
    });
});