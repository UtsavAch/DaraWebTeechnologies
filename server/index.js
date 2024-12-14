"use strict";

let PORT = 8116; // it must match 81xx being xx our group number (16)

let http = require("http");
let url = require("url");
let fs = require("fs");

const registerHandler = require("./handlers/register");
//const joinHandler = require('./handlers/join');
const rankingHandler = require("./handlers/ranking");

const headers = {
  plain: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  },
  sse: {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    Connection: "keep-alive",
  },
};

http
  .createServer(async function (request, response) {
    const preq = url.parse(request.url, true);
    const pathname = preq.pathname;
    let answer = {};

    switch (request.method) {
      case "GET":
        break;
      case "POST":
        switch (pathname) {
          case "/register":
            answer = await registerHandler(request);
            break;
          case "/join":
            answer = joinHandler(
              preq.query.group,
              preq.query.nick,
              preq.query.password,
              preq.query.size
            );
            break;
          case "/ranking":
            answer = await rankingHandler(request);
            console.log(answer);
            break;
          default:
            answer.status = 400;
        }
        break;
      default:
        answer.status = 400;
    }

    if (answer.status === undefined) answer.status = 200;
    if (answer.style === undefined) answer.style = "plain";

    response.writeHead(answer.status, headers[answer.style]);
    if (answer.style === "plain") response.end(JSON.stringify(answer.message));
  })
  .listen(PORT);
