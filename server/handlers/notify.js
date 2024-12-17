const fsp = require('fs').promises;

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


module.exports = async function(request) { //TODO: IMPLEMENT 
    let body = '';
    try {
        for await (const chunk of request){
            body += chunk
        }

        const { nick, password, game, cell } = JSON.parse(body); // the cell is itself an object with {square, position}


        if (!nick || !password || !game || !move) {
            return { status: 400, message: { error: "Invalid arguments." } };
        }

        

    } catch (error) {
        console.error('Internal error:', error.message);
        return { status: 500, style: 'plain', message: { error: 'Internal error' } };
    }
};