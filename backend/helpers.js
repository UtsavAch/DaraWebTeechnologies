/////////////////////////////////////////////////////////////////////////
//////HELPER FUNCTIONS
export function findTuplePosition(array, tuple) {
  for (let outerIndex = 0; outerIndex < array.length; outerIndex++) {
    for (
      let innerIndex = 0;
      innerIndex < array[outerIndex].length;
      innerIndex++
    ) {
      const currentTuple = array[outerIndex][innerIndex];
      if (currentTuple[0] === tuple[0] && currentTuple[1] === tuple[1]) {
        return [outerIndex, innerIndex];
      }
    }
  }
  return null;
}

//Check if the provided player is in given index
export function isPlayerInCell(board, player, index) {
  const [row, col] = index;
  if (row >= 0 && row < board.length && col >= 0 && col < board[0].length) {
    return board[row][col] === player;
  }
  return false;
}

//To check if a tuple is present in a given array
export function isTupleInArray(array, tuple) {
  return array.some((item) => item[0] === tuple[0] && item[1] === tuple[1]);
}
