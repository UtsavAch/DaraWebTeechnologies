//not used from here.....it is used in button-events

import { ranking } from "./server-communication-fetch";

class Player {
    constructor(name) {
        this.name = name;
        this.totalWins = 0;  // Total wins across all board sizes
        this.victoriesByBoardSize = {
            2: 0,
            3: 0,
            4: 0,
            5: 0
        };  // Object to store wins for each board size
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
        this.players = [];
    }

    // Add a new player to the leaderboard
    addPlayer(player) {
        this.players.push(player);
    }

    // Get the top players sorted by total wins
    getTopPlayers() {
        return this.players.sort((a, b) => b.totalWins - a.totalWins);
    }

    // Display the leaderboard
    displayLeaderboard() {
        const tableBody = document.querySelector("#leaderboard-table tbody");
        tableBody.innerHTML = "";

        const topPlayers = this.getTopPlayers();
        topPlayers.forEach(player => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = player.name;
            row.appendChild(nameCell);

            for(let size = 2; size <= 5; size++){
                const winCell = document.createElement("td");
                winCell.textContent = player.victoriesByBoardSize[size];
                row.appendChild(winCell);

            }

            const totalWinsCell = document.createElement("td");
            totalWinsCell.textContent = player.totalWins;
            row.appendChild(totalWinsCell);
        });
    }

    getTopPlayersMultiplayer() {
        let topPlayers;
        ranking(16,3).then((response) => {
            response.json().then((data) => {
                console.log(data);
                topPlayers = data;
            });
        });
        return topPlayers;
    }

    displayLeaderboardMultiplayer() {
        const tableBody = document.querySelector("#leaderboard-table tbody");
        tableBody.innerHTML = "";
        const topPlayers = this.getTopPlayersMultiplayer();

        topPlayers.forEach(player => {
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
        });
    }
}

export{ Player, Leaderboard};