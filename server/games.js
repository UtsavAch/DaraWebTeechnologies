"use strict";

const games = []; // memory array that stores the games temporaraly

module.exports = {
    games
};

/*
it should contain:
id
group
size 
players[] (one if waiting, two if playing)
turn // strts with players[0]
pahse // starts with placement
winner (null) ? i tjink is mostly necessary for leave ? but i thik is mostly necessary
board[] initially is [] after is ["empty", "empty",....]
*/ 