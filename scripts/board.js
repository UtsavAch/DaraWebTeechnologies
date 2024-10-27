const rows = 9;
const cols = 9;
const table = document.getElementById("myTable");
const usefulCells = [];

const centralRow = Math.ceil(rows / 2);
const centralCol = Math.ceil(cols / 2);

for (let i = 1; i <= rows; i++) {
  let row = document.createElement("tr");

  for (let j = 1; j <= cols; j++) {
    let cell = document.createElement("td");
    cell.className = "cell";
    cell.id = `cell-${i}-${j}`;

    let cellDiv = document.createElement("div");
    cellDiv.className = "cell-div";

    // Identify useful cells and exclude the central cell
    if (
      (i === j || i + j === rows + 1 || i === centralRow || j === centralCol) &&
      !(i === centralRow && j === centralCol)
    ) {
      usefulCells.push([i, j]);
      cell.classList.add("useful-cell");
    }

    cell.appendChild(cellDiv);
    row.appendChild(cell);
  }

  table.appendChild(row);
}

console.log("Useful Cells (excluding central):", usefulCells);
