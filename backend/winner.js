export function winner(board, player) {
  //player can be "player1" or "player2"
  //Will return true if the player has won, else false
  let p1Count = 0;
  let p2Count = 0;

  // Count the pieces of each player
  for (let square of board) {
    for (let cell of square) {
      if (cell === "p1") p1Count++;
      else if (cell === "p2") p2Count++;
    }
  }
  //If the player is winning, change the value to true
  let isWinner = false;

  switch (player) {
    case "player1":
      if (p2Count < 3 && p1Count >= 3) isWinner = true;
      break;
    case "player2":
      if (p1Count < 3 && p1Count >= 3) isWinner = true;
      break;
  }
  return isWinner;
}

const exampleBoard = [
  ["e", "p1", "p1", "e", "p2", "e", "e", "p2"],
  ["e", "p1", "e", "p1", "p1", "p1", "e", "e"],
  ["e", "p1", "e", "e", "e", "e", "p1", "e"],
  ["e", "e", "e", "p2", "e", "e", "p2", "e"],
];
// Each inner array represent the squares of the board from outermost to the innermost board
// "e" means the position is empty, "p1" means occupied by player1, "p2" means occupied by player2

// Mill checker, position is the new postion it moved to [row,col]
export function makesMill(board, player, position) {
  const numRows = board.length;
  const numCols = board[0].length;

  const row = position[0];
  const col = position[1];

  // Check Horizontal Mill (cyclic within the row)
  function checkHorizontalMill(row, col) {
    // Horizontal mill possibilities centered around the move
    const left = (col - 1 + numCols) % numCols;
    const right = (col + 1) % numCols;

    // Check if this move completes a horizontal mill
    return (
      (board[row][left] === player && board[row][right] === player) ||
      (board[row][(col + 2) % numCols] === player &&
        board[row][right] === player) ||
      (board[row][left] === player &&
        board[row][(col - 2 + numCols) % numCols] === player)
    );
  }

  // Helper to check specific vertical mill around the latest move
  function checkVerticalMill(row, col) {
    if (col % 2 === 1) {
      // Only vertical mills on odd columns
      const up = row - 1;
      const down = row + 1;

      // Check if this move completes a vertical mill
      return (
        (up >= 0 &&
          down < numRows &&
          board[up][col] === player &&
          board[down][col] === player) ||
        (down + 1 < numRows &&
          board[row][col] === player &&
          board[down][col] === player &&
          board[down + 1][col] === player) ||
        (up - 1 >= 0 &&
          board[row][col] === player &&
          board[up][col] === player &&
          board[up - 1][col] === player)
      );
    }
    return false;
  }

  // Check if a mill is formed
  const hasHorizontalMill = checkHorizontalMill(row, col);
  const hasVerticalMill = checkVerticalMill(row, col);

  //console.log("horizonmtal: ",hasHorizontalMill);
  //console.log("vertical: ",hasVerticalMill);

  return hasHorizontalMill || hasVerticalMill;
}

// Example usage
//const player = "p1";
//const position = [1, 1];
//console.log(makesMill(exampleBoard, player, position)); // Returns true if a mill is formed, false otherwise
