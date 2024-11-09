 function winner(board, player) {
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

// export function makesMill(board, player, lastMove) {
//   //player can be "player1" or "player2"
//   //Will return true if the player has made a mill, else false
//   const [squareIndex, posIndex] = lastMove; //you have to pass the last move made by the player as an idx pair
//   const square = board[squareIndex];
//   const squareSize = square.length;
//   if (player === "player1") player = "p1";
//   if (player === "player2") player = "p2";

//   // check the mills in the squares
//   const pairs = [
//     [
//       [1, 2],
//       [7, 6],
//     ], // case 0
//     [[0, 2]], // case 1
//     [
//       [0, 1],
//       [3, 4],
//     ], // case 2
//     [[2, 4]], // case 3
//     [
//       [2, 3],
//       [5, 6],
//     ], // case 4
//     [[4, 6]], // case 5
//     [
//       [7, 0],
//       [5, 4],
//     ], // case 6
//     [[6, 0]], // case 7
//   ];

//   if (
//     pairs[posIndex].some(
//       (pair) => square[pair[0]] === player && square[pair[1]] === player
//     )
//   ) {
//     return true;
//   }

//   //check the mills between squares
//   if (board.length >= 3) {
//     if (squareIndex === 0) {
//       if (board[1][posIndex] === player && board[2][posIndex] === player)
//         return true;
//     }
//     if (squareIndex === board.length - 1) {
//       if (
//         board[board.length - 2][posIndex] === player &&
//         board[board.length - 3][posIndex] === player
//       )
//         return true;
//     }
//     if (
//       board[squareIndex + 1][posIndex] === player &&
//       board[squareIndex - 1][posIndex] === player
//     )
//       return true;
//   }

//   return false;
// }

 function makesMill(board, player, lastMove) {
  //It works but the algorithm is not correct, need to implement correctly
  const [squareIndex, posIndex] = lastMove;

  if (
    typeof squareIndex === "undefined" ||
    typeof posIndex === "undefined" ||
    !board[squareIndex]
  ) {
    console.error(
      "Invalid squareIndex or posIndex in makesMill:",
      squareIndex,
      posIndex
    );
    return false;
  }

  const square = board[squareIndex];
  if (posIndex >= square.length) {
    console.error("posIndex out of bounds for square:", posIndex, square);
    return false;
  }

  const pairs = [
    [
      [1, 2],
      [7, 6],
    ],
    [[0, 2]],
    [
      [0, 1],
      [3, 4],
    ],
    [[2, 4]],
    [
      [2, 3],
      [5, 6],
    ],
    [[4, 6]],
    [
      [7, 0],
      [5, 4],
    ],
    [[6, 0]],
  ];

  // Check if `pairs[posIndex]` corresponds to valid mill patterns for `square`
  if (
    pairs[posIndex] &&
    pairs[posIndex].some(
      (pair) => square[pair[0]] === player && square[pair[1]] === player
    )
  ) {
    return true;
  }

  // Check mills across squares
  if (board.length >= 3) {
    if (
      (squareIndex === 0 &&
        board[1][posIndex] === player &&
        board[2][posIndex] === player) ||
      (squareIndex === board.length - 1 &&
        board[board.length - 2][posIndex] === player &&
        board[board.length - 3][posIndex] === player) ||
      (board[squareIndex + 1] &&
        board[squareIndex + 1][posIndex] === player &&
        board[squareIndex - 1] &&
        board[squareIndex - 1][posIndex] === player)
    ) {
      return true;
    }
  }

  return false;
}


// Mill checker, position is the new postion it moved to [row,col]
function checkForMill(board, player, position) {
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
      (board[row][(col + 2) % numCols] === player && board[row][right] === player) ||
      (board[row][left] === player && board[row][(col - 2 + numCols) % numCols] === player)
    );
  }

  // Helper to check specific vertical mill around the latest move
  function checkVerticalMill(row, col) {
    if (col % 2 === 1) { // Only vertical mills on odd columns
      const up = row - 1;
      const down = row + 1;


      // Check if this move completes a vertical mill
      return (
        (up >= 0 && down < numRows && board[up][col] === player && board[down][col] === player) ||
        (down + 1 < numRows && board[row][col] === player && board[down][col] === player && board[down + 1][col] === player) ||
        (up - 1 >= 0 && board[row][col] === player && board[up][col] === player && board[up - 1][col] === player)
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
const player = "p1";
const position = [1,1]
console.log(checkForMill(exampleBoard, player, position)); // Returns true if a mill is formed, false otherwise
