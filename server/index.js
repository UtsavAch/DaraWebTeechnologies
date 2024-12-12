"use strict";

let PORT     = 8116;

let http     = require('http');
let url      = require('url');

const headers = {
    plain: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'        
    },
    sse: {    
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};

function doGet(pathname, queryParams) {
    let answer = {};

    switch(pathname) { //INCOMPLETE I JUST PUT SOME EXAMPLES OF WHAT MIGTH BE AND WHAT WE NEED TO DO 
        case '/update':
            if (!queryParams.nick || !queryParams.game){
                answer.status = 400;
                answer.body = { "error": "Missing nick and/or game"}
            } else {
                answer.body = {}
            }
            break;
    default:
        answer.status = 404;
        answer.body = { "error": "Not Found" };
        break;
    }

    return answer;
}

function doPost(pathname, requestBody) {
    let answer = {};

    switch (pathname) { //INCOMPLETE I JUST PUT SOME EXAMPLES OF WHAT MIGTH BE AND WHAT WE NEED TO DO WE SHOULD ALSO CREATE A FUNCTION HANDLER FOR EACH CASE
        case "/register":
            if (!requestBody.nick || !requestBody.password) {
                answer.status = 400;
                answer.body = { error: "Missing parameters nick and/or password" };
            } else {
                /// ......
            }
            break;

        case "/join":
            if (!requestBody.nick || !requestBody.password || !requestBody.size) {
                answer.status = 400;
                answer.body = { error: "Missing parameters for join" };
            } else {
                // create the hash code stuff
            }
            break;

        case "/leave":
            if (!requestBody.nick || !requestBody.password || !requestBody.game) {
                answer.status = 400;
                answer.body = { error: "Missing parameters for leave" };
            } else {
                // update in game winner after, not in resoponse
            }
            break;

        case "/notify":
            if (!requestBody.nick || !requestBody.password || !requestBody.game || !requestBody.cell) {
                answer.status = 400;
                answer.body = { error: "Missing parameters for notify" };
            } else {
                //.....
            }
            break;

        case "/ranking":
            if (!requestBody.size) {
                answer.status = 400;
                answer.body = { error: "Invalid size" };
            } else {
                answer.body = { ranking: [{ nick: "player1", victories: 0, games: 1}]};
            break;
            }

        default:
            answer.status = 404;
            answer.body = { error: "Not Found" };
            break;
    }

    return answer;
}

// necessary to read body of POST, it uses stream module
function parseStreamBody(request, callback) {
    const chunks = [];

    // collects data chunks has they arrive
    request.on("data", (chunk) => {
        chunks.push(chunk);
    });

    // when evewy schunk is receive
    request.on("end", () => {
        const body = Buffer.concat(chunks).toString(); // join data to string
        try {
            const data = JSON.parse(body); // process query
            callback(null, data);
        } catch (error) {
            callback(error, null); // error if invalid
        }
    });

    request.on("error", (error) => {
        callback(error, null);
    });
}

// Lógica principal do servidor
http.createServer(function (request, response) {
    const preq = url.parse(request.url, true); 
    const pathname = preq.pathname;
    let answer = {};

    switch (request.method) {
        case "GET":
            answer = doGet(pathname, preq.query);
            if (answer.status === undefined) answer.status = 200;
            if (answer.style === undefined) answer.style = "plain";

            response.writeHead(answer.status, headers[answer.style]);
            response.end(JSON.stringify(answer.body));
            break;

        case "POST":
            parseStreamBody(request, (err, requestBody) => {
                if (err) {
                    answer.status = 400;
                    answer.body = { error: "Invalid JSON or body parsing error" };
                } else {
                    answer = doPost(pathname, requestBody);
                }

                if (answer.status === undefined) answer.status = 200;
                if (answer.style === undefined) answer.style = "plain";

                response.writeHead(answer.status, headers[answer.style]);
                response.end(JSON.stringify(answer.body));
            });
            break;

        default:
            answer.status = 400;
            answer.body = { error: "Invalid request method" };
            response.writeHead(answer.status, headers.plain);
            response.end(JSON.stringify(answer.body));
    }
}).listen(PORT);