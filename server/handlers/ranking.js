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
    const rankings = await readRankingFile();
    const aux = rankings.find((r) => r.size === size)
    if (aux) {
        return { status: 200, style: 'plain', rank: aux.ranking };
    } else {
        return { status: 404, style: 'plain', message: { error: `Size ${size} not found in group ${group}` } };
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