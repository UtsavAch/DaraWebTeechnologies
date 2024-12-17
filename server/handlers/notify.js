const fsp = require('fs').promises;
const { games } = require('../games');

async function readMyFile(fileName) {
    try {
        const data = await fsp.readFile(fileName);
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}


function isValidMove(game, cell) {
    const { board, phase } = game; // we only need this 2

    const {square, position} = cell;

    if ( // if is in bounds
        square < 0 || square >= board.length || 
        position < 0 || position >= board[0].length
    ) {
        return "Invalid move: Out of board bounds.";
    }

    // if its empty (valid)
    if (phase === "drop" && board[square][position] !== "empty") {
        return "Invalid move: Cell is not empty.";
    }

    return null; // its correct
}



module.exports = async function(request) { //TODO: IMPLEMENT 
    let body = '';
    try {
        for await (const chunk of request){
            body += chunk
        }

        const { nick, password, game, cell } = JSON.parse(body); // the cell is itself an object with {square, position}


        if (!nick || !password || !game || !cell) {
            return { status: 400, message: { error: "Invalid arguments." } };
        }

        if ((typeof nick) !== "string"){
            return {status: 400, style: 'plain', message: {error: 'Nickname is not string'}};
        }

        if ((typeof password) !== "string"){
            return {status: 400, style: 'plain', message: {error: 'Password is not string'}};
        }


        const users = await readMyFile('users.json'); // check if is authentic, function?
        const user = users.find((u) => u.nick === nick && u.password === password);
        if (!user) {
        return { status: 403, style: 'plain', message: { error: 'User not registered or incorrect password' } };
        }

        const currentGame = games.find(g => g.id === game); // game is incalid
        if (!currentGame) {
            return { status: 404, message: { error: "Game not found." } };
        }

        if (currentGame.turn !== nick) {
            return { status: 403, message: { error: "Not your turn to play" } };
        }

        const moveError = isValidMove(currentGame, cell);
        if (moveError) { // does not check if null
            return { status: 400, message: { error: moveError } };
        }

        const {square, position} = cell;
        if (currentGame.players[0] === nick){
            currentGame.board[square][position] = "blue";
        } else {
            currentGame.board[square][position] = "red"; // we defined blue for first player to join, red for other
        }

        const otherPlayer = currentGame.players.find(p => p !== nick);
        currentGame.turn = otherPlayer;

        console.log(currentGame.board);
        return { status: 200, message: {} }; // valid answer


    } catch (error) {
        console.error('Internal error:', error.message);
        return { status: 500, style: 'plain', message: { error: 'Internal error' } };
    }
};