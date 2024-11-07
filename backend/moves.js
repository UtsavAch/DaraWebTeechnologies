//Nine mens moris MOVES
// it locates te indexes of the given state in the board
function locate(board, state) {
  const location = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === state) {
        location.push([row, col]);
      }
    }
  }
  return location;
}

export function firstPhaseMove(board, player) {
  //player can be "player1" or "player2"
  //Will return the (best cell) to make a move in the given state of the board
  const emptyCells = locate(board, "e");

  // Return a random empty cell
  const bestCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return bestCell;
}

function canMove(location, board) {
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
    const newRow = row + dr;
    const newCol = col + dc;
    if (
      newRow >= 0 &&
      newRow < board.length &&
      newCol >= 0 &&
      newCol < board[0].length &&
      board[newRow][newCol] === "e"
    ) {
      possibleLocations.push([newRow, newCol]);
    }
  }

  return possibleLocations.length > 0 ? possibleLocations : false;
}

export function secondPhaseMove(board, player) {
  //player can be "player1" or "player2"
  //Will return the (best piece and the best cell it can move) in the given state of the board
  const playerMens = locate(board, player);

  let bestPiece = null;
  let bestCell = null;

  const movablePieces = playerMens.filter((piece) => canMove(piece, board));
  console.log(movablePieces);

  if (movablePieces.length > 0) {
    // chose random piece
    bestPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];

    // valid moves
    const possibleMoves = canMove(bestPiece, board);

    // choses rendom move
    bestCell = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  return bestPiece, bestCell; //Best piece is also a cell occupied by the best piece - so return the cell index
}

const exampleBoard = [
  ["e", "e", "p1", "e", "p2", "e", "e", "p2"],
  ["p1", "p1", "e", "e", "p2", "e", "e", "e"],
  ["e", "e", "e", "e", "e", "e", "p1", "e"],
  ["e", "p1", "e", "p2", "e", "e", "p2", "e"],
];
// Each inner array represent the squares of the board from outermost to the innermost board
// "e" means the position is empty, "p1" means occupied by player1, "p2" means occupied by player2

const bestMove = firstPhaseMove(exampleBoard, "p1");
// console.log("First phase move -> " + bestMove);
const p1cells = locate(exampleBoard, "p1");
const move = secondPhaseMove(exampleBoard, "p1");
// console.log("Seconf phase move -> " + move);

/*

0   ["e" , "e" , "p1", "e" , "p2", "e" , "e" , "p2"],
1   ["p1", "p1", "e" , "e" , "p2", "e" , "e" , "e"],
2   ["e" , "e" , "e" , "e" , "e" , "e" , "p1", "e"],
3   ["e ", "p1", "e" , "p2", "e" , "e" , "p2", "e"],
      0     1     2     3     4     5     6    7  

*/
