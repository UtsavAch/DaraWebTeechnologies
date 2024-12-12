const fsp = require('fs').promises;

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
                /* erros de JSON */ 
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
