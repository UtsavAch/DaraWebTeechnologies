const fsp = require('fs').promises;
const { games } = require('../games');

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


// cheks if is a valid move  location is the peice is moving
function canMove(location, board) { // i think we sould use it, is from bakend file
    const possibleLocations = [];
    const row = location[0];
    const col = location[1];
  
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0], // Right, Left, Down, Up
    ];
  
    for (let [dr, dc] of directions) {
      let newRow = row + dr;
      let newCol = col + dc;
  
      // horizontal movement with ciclical conenction in rows
      if (dr === 0) {
        newCol = (newCol + board[0].length) % board[0].length;
      }
  
      // verifies if a position is inside the limits and is empty
      // limits vertical movement to lines that are not divisable by 2
      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length &&
        board[newRow][newCol] === "empty" &&
        (dr === 0 || col % 2 !== 0)
      ) {
        possibleLocations.push([newRow, newCol]);
      }
    }
    //console.log(possibleLocations);
  
    return possibleLocations;
}



function playersColour(players, nick){
    if (players[0] === nick) return "blue";
    return "red";
}

function OLDisValidMove(game, cell, nick) {//FIXME: THIS ONLY WORKS IF IN MOVE PHASE
    const {players, board, turn, phase, step, last } = game; // we only need this 2

    const {square, position} = cell; // to move to
    const {lastSquare, lastPosition} = last

    if ( // if is in bounds
        square < 0 || square >= board.length || 
        position < 0 || position >= board[0].length
    ) {
        return "Invalid move: Out of board bounds.";
    }

    // if its empty (valid)
    if (phase === "drop" && board[square][position] !== "empty") {
        return "Invalid move: Cell is not empty.";
    }

    if (phase === "move"){ // CHECK IF MOVES ARE VALID IN MOVE TODO: finish up the logic
        
        if (step === "from" && board[square][position] !== playersColour(players, nick)){ // WE SELECT OUR PIECE TO MOVE
            return "Invalid move: Cell is not yors to move"
        }

        if (step === "to") {
            // anul slection
            if (square === lastSquare && position === lastPosition) return null;

            // check if desteny ies empty
            if (board[square][position] !== "empty") {
                return "Invalid move: Target cell is not empty.";
            }


            // chek if is adjeacent!!!!!

        }

        if (step === "capture" && board[square][position] === playersColour(players, nick)){ 
            return "Invalid move: Cell needs to be from opponent"
        }


    }

    return null; // its correct
}

// same as backemd
function makesMill(board, player, position) {
    const numRows = board.length;
    const numCols = board[0].length;
  
    const row = position[0];
    const col = position[1];
  
    function checkHorizontalMill(row, col) {
      if (col % 2 === 0) {
        // For even columns, check wrap-around possibilities
        const left1 = (col - 1 + numCols) % numCols;
        const left2 = (col - 2 + numCols) % numCols;
        const right1 = (col + 1) % numCols;
        const right2 = (col + 2) % numCols;
  
        return (
          (board[row][left1] === player && board[row][left2] === player) ||
          (board[row][right1] === player && board[row][right2] === player)
        );
      } else {
        // For odd columns, only check adjacent cells
        const left = col - 1;
        const right = col + 1;
  
        return (
          (left >= 0 && board[row][left] === player) &&
          (right < numCols && board[row][right] === player)
        );
      }
    }
  
    // Helper to check specific vertical mill around the latest move
    function checkVerticalMill(row, col) {
      if (col % 2 === 1) {
        // Only vertical mills on odd columns by vertical mill i mean form diferent rows
        const up = row - 1;
        const down = row + 1;
  
        // Check if this move completes a vertical mill
        return (
          (up >= 0 &&
            down < numRows &&
            board[up][col] === player &&
            board[down][col] === player) ||
          (down + 1 < numRows &&
            board[down][col] === player &&
            board[down + 1][col] === player) ||
          (up - 1 >= 0 &&
            board[up][col] === player &&
            board[up - 1][col] === player)
        );
      }
      return false;
    }
  
    // Check if a mill is formed
    const hasHorizontalMill = checkHorizontalMill(row, col);
    const hasVerticalMill = checkVerticalMill(row, col);
  
    //console.log("new position:",position);
    //console.log("new board:",board);
    //console.log("horizonmtal: ",hasHorizontalMill);
    //console.log("vertical: ",hasVerticalMill);
  
    return hasHorizontalMill || hasVerticalMill;
}

function isValidMove(from, to, board) {
    const possibleMoves = canMove(from, board);

    // chekc if in valid play
    for (const [row, col] of possibleMoves) {
        if (row === to[0] && col === to[1]) {
            return true; 
        }
    }
    return false;
}


function winner(board, playerColor) {
    let player1Count = 0;
    let player2Count = 0;
  
    for (let square of board) {
      for (let cell of square) {
        if (cell === "blue") player1Count++;
        else if (cell === "red") player2Count++;
      }
    }
  
    if (playerColor === "blue" && player2Count < 3 && player1Count >= 3) {
      return true;
    } else if (playerColor === "red" && player1Count < 3 && player2Count >= 3) {
      return true;
    }
  
    return false;
  }
  


module.exports = async function(request) { //TODO: COMPLETE 
    let body = '';
    try {
        for await (const chunk of request){
            body += chunk
        }

        const { nick, password, game, cell } = JSON.parse(body); // the cell is itself an object with {square, position}


        if (!nick || !password || !game || !cell) {
            return { status: 400, message: { error: "Invalid arguments." } };
        }

        if ((typeof nick) !== "string"){
            return {status: 400, style: 'plain', message: {error: 'Nickname is not string'}};
        }

        if ((typeof password) !== "string"){
            return {status: 400, style: 'plain', message: {error: 'Password is not string'}};
        }


        const users = await readMyFile('users.json'); // check if is authentic, function?
        const user = users.find((u) => u.nick === nick && u.password === password);
        if (!user) {
        return { status: 403, style: 'plain', message: { error: 'User not registered or incorrect password' } };
        }

        const currentGame = games.find(g => g.id === game); // game is incalid
        if (!currentGame) {
            return { status: 404, message: { error: "Game not found." } };
        }

        if (currentGame.turn !== nick) {
            return { status: 403, message: { error: "Not your turn to play" } };
        }

        /*const moveError = isValidMove(currentGame, cell, nick);
        if (moveError) { // does not check if null
            return { status: 400, message: { error: moveError } };
        }*/

        const {square, position} = cell; 

        if (phase === "drop"){

            if (currentGame.board[square][position] === "empty"){
                currentGame.board[square][position] = playersColour(players, nick);
                const otherPlayer = currentGame.players.find(p => p !== nick);
                currentGame.turn = otherPlayer;
            } else {
                return { status: 400, message: { error: "Invalid move: Not a valid position." } };
            }

            if (
                currentGame.board.flat().filter(c => c !== "empty").length ===
                8*currentGame.size - currentGame.size*3*2 // all stpots - all players pieces 
            ) {
                currentGame.phase = "move";
                currentGame.step = "from"; // irrelevant is alredy initialized as that
            }

        }

        if (phase === "move"){ //TODO: FINISH UP IMPLEMENTING
            // do somethiing....
            if (currentGame.step === "from"){
                currentGame.last.square = square;
                currentGame.last.position = position;
                currentGame.step = "to";
            } else if(currentGame.step === "to"){

                const from = [currentGame.last.square, currentGame.last.position];
                const to = [square, position];

                if (square === currentGame.last.square && position === currentGame.last.position) {
                    currentGame.step = "from"; // anul selection
                } else {


                    const isMoveValid = isValidMove(from, to, currentGame.board);
                    if (!isMoveValid) {
                        return { status: 400, message: { error: "Invalid move: Not a valid position." } };
                    }

                    currentGame.board[from[0]][from[1]] = "empty";
                    currentGame.board[to[0]][to[1]] = playersColour(currentGame.players, nick);
                    currentGame.step = "from"; //resets 
                    //currentGame.last = null;

                    const hasMill = makesMill(currentGame.board, nick, to);
                    if (hasMill){
                        currentGame.step = "capture";
                    } else {
                        const otherPlayer = currentGame.players.find(p => p !== nick);
                        currentGame.turn = otherPlayer; // ends turn
                    }


                }


                /*const isMoveValid = isValidMove(from, to, currentGame.board);
                if (!isMoveValid) {
                    return { status: 400, message: { error: "Invalid move: Not a valid position." } };
                }

                currentGame.board[from[0]][from[1]] = "empty";
                currentGame.board[to[0]][to[1]] = playersColour(currentGame.players, nick);
                currentGame.step = "from"; // Reseta o passo

                if (square === currentGame.last.square && position === currentGame.last.position) {
                    currentGame.step = "from"; // anul selection
                } else {
                    currentGame.board[currentGame.last.square][currentGame.last.position] = "empty"; // places it there
                    currentGame.board[square][position] = playersColour(currentGame.players, nick);
                    currentGame.last = null; // player has no last move
            
                }*/
            }




            // the player is still playing

            /*if(currentGame.step === "to"){
                if (square === currentGame.last.square &&  position === currentGame.last.position){
                    // it stays the same goes back to from step
                    currentGame.step = "from"
                } else {
                    currentGame.board[square][position] = playersColour(players, nick);
                }
            }*/

            if (currentGame.step === "capture"){ // capture the piece
                currentGame.board[square][position] = "empty"
            }


            const isWinner = winner(currentGame.board, playersColour(currentGame.players, nick));
            if (isWinner) {
                currentGame.winner = nick;
            } // i think ranking it is updated when leave
        }


        /*if (currentGame.players[0] === nick){
            currentGame.board[square][position] = "blue";
        } else {
            currentGame.board[square][position] = "red"; // we defined blue for first player to join, red for other
        }*/

        //const otherPlayer = currentGame.players.find(p => p !== nick);
        //currentGame.turn = otherPlayer;

        console.log(currentGame.board);
        return { status: 200, message: {} }; // valid answer


    } catch (error) {
        console.error('Internal error:', error.message);
        return { status: 500, style: 'plain', message: { error: 'Internal error' } };
    }
};