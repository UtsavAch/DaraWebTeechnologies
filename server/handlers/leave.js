const { games } = require('../games');
const fsp = require('fs').promises;

// Read users file (similar to register handler)
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


async function saveRankingFile(ranking) {
    try{
        await fsp.writeFile('ranking.json', JSON.stringify(ranking, null, 2));

    } catch(error) {
        console.log('Error writing file: ', error.message);
        throw error;
    }
    
}

module.exports = async function(request){
    let body = '';
    try {
        for await (const chunk of request){
            body += chunk
        }

        //console.log('Request Body:', body);//debug

        //const query = JSON.parse(body);
        const { nick, password, game } = JSON.parse(body); // using this way i think is easier and more readble

        //console.log('Parsed Params:', { nick, password, game });//debug

        if (!nick || !password || !game){ // i dont think that we need to check evry error at a time
            return { status: 400, style: 'plain', message: { error: 'Invalid arguments' } };
        }

        if ((typeof nick) !== "string"){
            return {status: 400, style: 'plain', message: {error: 'Nickname is not string'}};
        }

        if ((typeof password) !== "string"){
            return {status: 400, style: 'plain', message: {error: 'Password is not string'}};
        }

        const users = await readMyFile('users.json');
        const user = users.find(u => u.nick === nick && u.password === password);
        if (!user) {
            return { status: 401, message: { error: "Invalid authentication." } };
        }

        //console.log('User Found:', user);//debug

        const currentGame = games.find(g => g.id === game);
        if (!currentGame) {
            return { status: 404, message: { error: "Game not found." } };
        }

        //console.log('Current Game:', currentGame);//debug

        let winner = null;
        if (currentGame.board.length === 0) {
            // waiting removes player
            currentGame.players = currentGame.players.filter(p => p !== nick);
            return { status: 200, message: { winner: `${currentGame.winner}` } }; // initialy is null
        } else {
            // game in proces - conceds to adversary
            winner = currentGame.players.find(p => p !== nick);
            currentGame.winner = winner;
        }

        if (winner){
            const ranking = await readMyFile('ranking.json');
            const gameZise = currentGame.size;

            let sizeRanking = ranking.find(r => r.size === gameZise);
            if (!sizeRanking){
                sizeRanking
            }

            const updatePlayerStats = (playerNick, isWinner) => {
                let player = sizeRanking.ranking.find(p => p.nick === playerNick);
                if (!player) {
                    player = { nick: playerNick, victories: 0, games: 0 };
                    sizeRanking.ranking.push(player);
                }
                player.games += 1;
                if (isWinner) player.victories += 1;
            };

            updatePlayerStats(winner, true); // winener
            updatePlayerStats(nick, false);  // loser

            await saveRankingFile(ranking);

        }

        return { status: 200, message: { winner: `${winner}` } };

    } catch(error) {
        console.error('Internal error:', error.message);
        return { status: 500, style: 'plain', message: { error: 'Internal error' } };
    }
}