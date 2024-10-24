const rows = 7;
const cols = 7;
const table = document.getElementById("myTable");
const usefulCells = []; // List to store useful cell tuples

const centralRow = Math.ceil(rows / 2);
const centralCol = Math.ceil(cols / 2);

for (let i = 1; i <= rows; i++) {
  let row = document.createElement("tr");

  for (let j = 1; j <= cols; j++) {
    let cell = document.createElement("td");
    cell.className = "cell";
    cell.id = `cell-${i}-${j}`;

    // Create a div inside each cell with the class "cell-div"
    let cellDiv = document.createElement("div");
    cellDiv.className = "cell-div";

    // Check for useful cells (diagonals, central row, and central column)
    if (
      (i === j || i + j === rows + 1 || i === centralRow || j === centralCol) &&
      !(i === centralRow && j === centralCol)
    ) {
      usefulCells.push([i, j]); // Add the tuple (i, j) to the usefulCells list
      cell.classList.add("useful-cell"); // Add the class "useful-cell" to the useful cells
    }

    cell.appendChild(cellDiv); // Append the div to the cell
    row.appendChild(cell); // Append the cell to the row
  }

  table.appendChild(row); // Append the row to the table
}

console.log("Useful Cells (excluding central):", usefulCells);
