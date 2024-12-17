const fsp = require('fs').promises;

async function readRankingFile() { // TRY TO MODULDARIZE TO NEW METHOD with readUsersFile
    try{
        const data = await fsp.readFile('ranking.json');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT'){
            return [];
        }
        throw error; // if other kind of error
    }
}

async function getRanking(group, size) {
    try {
        const rankings = await readRankingFile(); 
        const aux = rankings.find((r) => r.size === size);
        
        if (aux) {
            const sortedRanking = aux.ranking
                .sort((a, b) => {
                    if (b.victories === a.victories) {
                        return a.games - b.games; // if victories are the same uses games played to see
                    }
                    return b.victories - a.victories; 
                })
                .slice(0, 10); // fisrt 10 players

                //console.log(sortedRanking); //debug
            return { status: 200, style: 'plain', message: {ranking: sortedRanking} };
        } else {
            return { 
                status: 404, 
                style: 'plain', 
                message: { error: `Size ${size} not found in group ${group}` } 
            };
        }
    } catch (error) {
        console.error('Error fetching ranking:', error.message);
        return { 
            status: 500, 
            style: 'plain', 
            message: { error: 'Internal server error' } 
        };
    }
}

module.exports = async function(request){
    let body = '';
    try {
        for await (const chunk of request){
            body += chunk
        }

        const query = JSON.parse(body);

        if (!Number.isInteger(query.group)){
            return {status: 400, style: 'plain', message: {error: `Undefined group: '${query.group}'`}};
        }

        if (!Number.isInteger(query.size)) {
            return { status: 400, style: 'plain', message: { error: `Invalid size: '${query.size}'`} };
        }

        return await getRanking(query.group, query.size);
    } catch (error) {

        if (error instanceof SyntaxError){
            console.log("Invalid JSON");
            return { status: 400, style: 'plain', message: { error: 'Invalid JSON' } };
        }
        
        console.error('Internal error:', error.message);
        return { status: 500, style: 'plain', message: { error: 'Internal error' } };
    }
};