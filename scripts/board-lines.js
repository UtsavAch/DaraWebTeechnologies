/////////////////////////////////////////////////
// Function to remove borders for specific cells
// That is to create a pattern of lines
// ## DO NOT CHANGE THIS CODE ##
/////////////////////////////////////////////////
import { rows, cols, centralRow, centralCol } from "./board.js";

function removeBorders(cellId, borders) {
  const cell = document.getElementById(cellId);
  if (cell) {
    if (borders.includes("top")) cell.style.borderTop = "none";
    if (borders.includes("bottom")) cell.style.borderBottom = "none";
    if (borders.includes("left")) cell.style.borderLeft = "none";
    if (borders.includes("right")) cell.style.borderRight = "none";
  }
}

//////// BOTTOM-TOP-LEFT-RIGHT
for (let i = centralRow; i <= rows; i++) {
  let id = `cell-${i}-${i}`;
  let borders = ["bottom", "top", "left", "right"];
  removeBorders(id, borders);
}

//////// BOTTOM-RIGHT
for (let i = 1; i < centralRow; i++) {
  let id = `cell-${i}-${i}`;
  let borders = ["bottom", "right"];
  removeBorders(id, borders);
}

// Remove borders for the central row (except for the central cell)
for (let col = 1; col <= cols; col++) {
  if (col !== centralCol) {
    let id = `cell-${centralRow}-${col}`;
    let borders = ["bottom", "right"];
    removeBorders(id, borders);
  }
}

// Remove borders for the central column (except for the central cell)
for (let row = 1; row <= rows; row++) {
  if (row !== centralRow) {
    let id = `cell-${row}-${centralCol}`;
    let borders = ["bottom", "right"];
    removeBorders(id, borders);
  }
}

///////BOTTOM-LEFT-RIGHT
for (let i = 1; i < rows; i++) {
  let id = `cell-${rows}-${i}`;
  let borders = ["bottom", "left", "right"];
  removeBorders(id, borders);
}

{
  let a = 2;
  let b = cols;
  for (let i = 1; i < centralCol - 1; i++) {
    for (let j = a; j < b; j++) {
      if (j != centralCol) {
        let id = `cell-${i}-${j}`;
        let borders = ["bottom", "left", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}

//Around the center
{
  let id = `cell-${centralRow - 1}-${centralCol}`;
  let borders = ["bottom", "left", "right"];
  removeBorders(id, borders);
}

{
  let a = 2;
  let b = cols - 1;
  for (let i = cols - 1; i > centralCol; i--) {
    for (let j = a; j < b; j++) {
      if (j != centralCol) {
        let id = `cell-${i}-${j}`;
        let borders = ["bottom", "left", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}

//////// BOTTOM-TOP-RIGHT
for (let i = 1; i < cols; i++) {
  let id = `cell-${i}-${cols}`;
  let borders = ["bottom", "top", "right"];
  removeBorders(id, borders);
}

{
  let a = 2;
  let b = rows;
  for (let i = 1; i < centralRow - 1; i++) {
    for (let j = a; j < b; j++) {
      if (j != centralRow) {
        let id = `cell-${j}-${i}`;
        let borders = ["bottom", "top", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}

//Around the center
{
  let id = `cell-${centralRow}-${centralCol - 1}`;
  let borders = ["bottom", "top", "right"];
  removeBorders(id, borders);
}

{
  let a = 2;
  let b = rows - 1;
  for (let i = cols - 1; i > centralRow; i--) {
    for (let j = a; j < b; j++) {
      if (j != centralRow) {
        let id = `cell-${j}-${i}`;
        let borders = ["bottom", "top", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}
