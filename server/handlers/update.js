const { games } = require('../games');


module.exports = async function (request) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const game = url.searchParams.get("game");
    const nick = url.searchParams.get("nick");

    if (!game || !nick) {
        return { status: 400, message: { error: "Missing arguments: 'game' or 'nick'." } };
    }

    const currentGame = games.find(g => g.id === game);
    if (!currentGame) {
        return { status: 404, message: { error: "Game not found." } };
    }

    if ((typeof query.nick) !== "string"){
        return {status: 400, style: 'plain', message: {error: 'Nickname is not string'}};
    }

    const playersColors = {};
    currentGame.players.forEach((player, index) => {
        playersColors[player] = index === 0 ? "blue" : "red";
    });

    return {
        status: 200,
        message: {
            board: currentGame.board,
            phase: currentGame.phase,
            step: currentGame.step,
            turn: currentGame.turn,
            players: playersColors
        }
    };
};