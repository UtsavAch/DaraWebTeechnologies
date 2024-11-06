function firstPhaseMove(board, player) {
  //player can be "player1" or "player2"
  //Will return the (best cell) to make a move in the given state of the board
  const emptyCells = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === "e") {
        emptyCells.push([row + 1, col + 1]);
      }
    }
  }

  // Return a random empty cell
  const bestCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return bestCell;
}

function secondPhaseMove(board, player) {
  //player can be "player1" or "player2"
  //Will return the (best piece and the best cell it can move) in the given state of the board
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

const bestMove = firstPhaseMove(exampleBoard, _);
console.log("First phase move -> " + bestMove);
