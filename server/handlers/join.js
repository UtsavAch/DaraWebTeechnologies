const fsp = require('fs').promises;
const crypto = require('crypto');

// In-memory games array
let games = [];

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
        players: [nick]
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

        if (!query.nick) {
            return { status: 400, style: 'plain', message: { error: 'Nickname missing' } };
        }

        if (!query.password) {
            return { status: 400, style: 'plain', message: { error: 'Password missing' } };
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