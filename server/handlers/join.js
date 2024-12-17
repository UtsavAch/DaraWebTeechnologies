const fsp = require('fs').promises;
const crypto = require('crypto');


// reads users file
async function readFileData(fileName) {
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

async function writeFile(fileName, data) {
    try {
        await fsp.writeFile(fileName, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error in writing data in file ${fileName}:`, error);
        throw error;
    }
}


async function checkUser(nick, password){
    const users = await readFile('users.jason');
    const user = users.find((u) => u.nick === nick);

    if (user){
        if (user.password !== password){
            console.log("Invalid password!");
            return false;
        }
        return true;
    }
    console.log("Invalid user!")
    return false;
}

function generateHash(value) {
    return crypto.createHash('md5').update(value).digest('hex');
}

module.exports = async function(request){
    let body = '';
    try {
        for await (const chunk of request){
            body += chunk
        }

        const query = JSON.parse(body);
        const {group, nick, password, size} = query

        if (!group || !nick || !password || !size) {
            return resolve({ status: 400, message: {error: 'Invalid paramaters or absent.'} });
        }


        const isUserValid = await checkUser(nick, password);
        if (!isUserValid){
            return {status: 401, message: {error: 'Inavalid user or password'}}
        }

        const pendings = await readFileData('pending.json');
        const matchIndex = pendings.findIndex((p) => p.group === group && p.size === size);


        if (matchIndex !== -1) {
            // joins player
            const matchedPlayer = pendings.splice(matchIndex, 1)[0];
            const gameId = matchedPlayer.cipher;

            // new pendings
            await writeFile('pending.json', pendings);

            return {
                status: 200,
                //message: 'Players matched!',
                game: gameId,
                //players: [matchedPlayer.nick, nick],
            };
        } else {
            const cipher = generateHash(`${group}_${size}_${Date.now()}`);
            pendings.push({ group, nick, size, cipher });
            await writeFile('pending.json', pendings);

            return {
                status: 200,
                //message: 'Waiting for another player...',
                cipher,
            };
        }

    } catch {
        console.error('Error processing /join:', error);
        return { status: 500, message: 'Internal server error.' };
    }
}