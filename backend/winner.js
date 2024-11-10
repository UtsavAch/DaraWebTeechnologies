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
    case "p1":
      if (p2Count < 3 && p1Count >= 3) isWinner = true;
      break;
    case "p2":
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
        (left >= 0 && board[row][left] === player && board[row][col] === player) &&
        (right < numCols && board[row][right] === player && board[row][col] === player)
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

  console.log("new position:",position);
  console.log("new board:",board);
  console.log("horizonmtal: ",hasHorizontalMill);
  console.log("vertical: ",hasVerticalMill);

  return hasHorizontalMill || hasVerticalMill;
}

// Example usage
const player = "p1";
const position = [1, 1];
console.log(makesMill(exampleBoard, player, position)); // Returns true if a mill is formed, false otherwise
