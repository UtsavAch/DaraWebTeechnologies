const fsp = require('fs').promises;
const crypto = require('crypto');
const { games } = require('../games'); // module so is better acced to every one who needs it

// In-memory games array
//let games = [];

// Read users file (similar to register handler)
async function readUsersFile() {
    try {
        const data = await fsp.readFile('users.json');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

function createEmptyBoard(size) {
    return Array(size) 
        .fill()        
        .map(() => Array(8).fill("empty")); 
}


// Join game logic
async function joinGame(nick, password, group, size) {
    // Validate user
    const users = await readUsersFile();
    const user = users.find((u) => u.nick === nick && u.password === password);

    if (!user) {
        return { status: 403, style: 'plain', message: { error: 'User not registered or incorrect password' } };
    }

    // Try to find an existing game with space
    let existingGame = games.find(game => 
        game.group === group && 
        game.size === size && 
        game.players.length == 1
    );

    if (existingGame) {
        // Add player to existing game
        existingGame.players.push(nick);
        existingGame.board = createEmptyBoard(existingGame.size); // creates the board
        console.log(existingGame);
        return { 
            status: 200, 
            style: 'plain', 
            message: { 
                game: existingGame.id, 
            } 
        };
    }

    // Create a new game if no suitable game exists
    const newGameId = crypto.randomBytes(16).toString('hex');
    const newGame = {
        id: newGameId,
        group: group,
        size: size,
        players: [nick],
        winner: null, 
        turn: nick, // added i dont think it messes with the other logic
        phase: "drop", // added i dont think it messes with the other logic
        board: [],
        step: "from", // only usefull later 
        last: {square:0, position:0} // I DONT KNOW IF IL USE IT
    };

    // Add new game to games array
    games.push(newGame);

    return { 
        status: 200, 
        style: 'plain', 
        message: { 
            game: newGameId,
        } 
    };
}

// Handler for join endpoint
module.exports = async function(request) {
    let body = '';
    try {
        for await (const chunk of request){
            body += chunk
        }

        const query = JSON.parse(body);

        // Validate inputs
        if (!query.group) {
            return { status: 400, style: 'plain', message: { error: 'Group missing' } };
        }

        if (isNaN(query.group)) {
            return { status: 400, style: 'plain', message: { error: 'Group not a number' } };
        }

        if (!query.nick) {
            return { status: 400, style: 'plain', message: { error: 'Nickname missing' } };
        }

        if ((typeof query.nick) !== "string"){
            return {status: 400, style: 'plain', message: {error: 'Nickname is not string'}};
        }

        if (!query.password) {
            return { status: 400, style: 'plain', message: { error: 'Password missing' } };
        }

        if ((typeof query.password) !== "string"){
            return {status: 400, style: 'plain', message: {error: 'Password is not string'}};
        }

        if (!query.size || isNaN(query.size) || query.size < 2 || query.size > 5) {
            return { status: 400, style: 'plain', message: { error: 'Invalid game size' } };
        }

        // Call join game logic
        return await joinGame(query.nick, query.password, query.group, Number(query.size));

    } catch (error) {
        console.error('Internal error:', error.message);
        return { status: 500, style: 'plain', message: { error: 'Internal error' } };
    }
};