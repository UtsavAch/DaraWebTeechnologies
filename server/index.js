"use strict";

let PORT     = 8001;

let http     = require('http');
let url      = require('url');

let counter  = require('./model.js');
let updater  = require('./updater.js');

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


http.createServer(function (request, response) {
    const preq = url.parse(request.url,true);
    const pathname = preq.pathname;
    let answer = {};

    switch(request.method) {
    case 'GET':
        answer = doGet(pathname,request,response);
        break;
    case 'POST':
        answer = doPost(pathname);
        break;
    default:
        answer.status = 400;
    }

}).listen(PORT);