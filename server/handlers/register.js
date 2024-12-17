const fsp = require('fs').promises;

// reads users file
async function readUsersFile() { // TRY TO MODULDARIZE TO NEW METHOD with readRankingFile, it would receive fileName and use it, the rest is the same
    try{
        const data = await fsp.readFile('users.json');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT'){
            return [];
        }
        throw error; // if other kind of error
    }
}

// it writes users in file
async function writeUsersFile(users) {
    try{
        await fsp.writeFile('users.json', JSON.stringify(users, null, 2));
    } catch (error) {
        console.log('Error writing file: ',error.message);
        throw error;
    }
}

// register user
async function registerUser(nick, password) {
    const users = await readUsersFile();
    const user = users.find((u) => u.nick === nick);

    if (user){
        if (user.password !== password){
            console.log("User registration with different password");
            return {status: 400, style: 'plain', message: {error: 'User registration with different password'}};
        }
        return { status: 200, style: 'plain' };
    }

    users.push({nick, password});
    await writeUsersFile(users);
    return { status: 200, style: 'plain' };
}

// method to register a user
module.exports = async function(request){
    let body = '';
    try {
        for await (const chunk of request){
            body += chunk
        }

        const query = JSON.parse(body);

        if (!query.nick){
            return {status: 400, style: 'plain', message: {error: 'Nickname missing'}};
        }

        if (!query.password) {
            return { status: 400, style: 'plain', message: { error: 'Password missing' } };
        }

        return await registerUser(query.nick, query.password);
    } catch (error) {

        if (error instanceof SyntaxError){
            console.log("Invalid JSON");
            return { status: 400, style: 'plain', message: { error: 'Invalid JSON' } };
        }
        
        console.error('Internal error:', error.message);
        return { status: 500, style: 'plain', message: { error: 'Internal error' } };
    }
};

/* OLD CODE
module.exports = function(request){
    let body = '';
    let query = {};
    return new Promise((resolve, reject) => {
    request
        .on('data', (chunk) => { body += chunk;  })
        .on('end', () => {
            try { 
                query = JSON.parse(body);
            } catch(err) {
            }
            if(query.nick === undefined){
                resolve({ status: 400, style: 'plain', message: { error: 'Nickname missing' } });
                return;
            }
        
            if(query.password === undefined){
                resolve({ status: 400, style: 'plain', message: {error: 'Password missing' } });
                return;
            }

            //check user in filesystem
            fsp.readFile('users.json').then((data) => {
                let users;
                try{
                    users = JSON.parse(data);
                }catch(err){
                    users = [];
                }
                let user = users.find(u => u.nick === query.nick);
                if(user !== undefined){
                    if(user.password !== query.password){
                        resolve({ status: 403, style: 'plain', message: { error: 'User registered with a different password' } });
                        return;
                    }
                    resolve({ status: 200, style: 'plain' });
                    return;
                }else{
                    users.push({ nick: query.nick, password: query.password });
                    fsp.writeFile('users.json', JSON.stringify(users))
                        .then(() => { 
                            resolve({ status: 200, style: 'plain' });
                            return;
                        })
                        .catch((err) => {
                            resolve({ status: 500, style: 'plain', message: { error: 'Internal error' } });
                            return;
                        });
                }
            }).catch((err) => { 
                if (err.code === 'ENOENT') {
                    // File doesn't exist: create it and add the user
                    let users = [{ nick: query.nick, password: query.password }];
        
                    fsp.writeFile('users.json', JSON.stringify(users))
                        .then(() => {
                            resolve({ status: 200, style: 'plain' });
                        })
                        .catch((writeErr) => {
                            console.error('Error writing file:', writeErr.message);
                            resolve({ status: 500, style: 'plain', message: { error: 'Internal error' } });
                        });
                } else {
                    console.error('Error reading file:', err.message);
                    resolve({ status: 500, style: 'plain', message: { error: 'Internal error' } });
                }
            });
                })
        .on('error', (err) => { 
            resolve({status: 400, style: 'plain', message: { error: 'Bad request' } });
            return;
        });
    });
}
*/

