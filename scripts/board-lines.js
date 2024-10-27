/////////////////////////////////////////////////
// Function to remove borders for specific cells
// That is to create a pattern of lines
// ## DO NOT CHANGE THIS CODE ##
/////////////////////////////////////////////////

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
  id = `cell-${i}-${i}`;
  borders = ["bottom", "top", "left", "right"];
  removeBorders(id, borders);
}

//////// BOTTOM-RIGHT
for (let i = 1; i < centralRow; i++) {
  id = `cell-${i}-${i}`;
  borders = ["bottom", "right"];
  removeBorders(id, borders);
}

// Remove borders for the central row (except for the central cell)
for (let col = 1; col <= cols; col++) {
  if (col !== centralCol) {
    id = `cell-${centralRow}-${col}`;
    borders = ["bottom", "right"];
    removeBorders(id, borders);
  }
}

// Remove borders for the central column (except for the central cell)
for (let row = 1; row <= rows; row++) {
  if (row !== centralRow) {
    id = `cell-${row}-${centralCol}`;
    borders = ["bottom", "right"];
    removeBorders(id, borders);
  }
}

///////BOTTOM-LEFT-RIGHT
for (let i = 1; i < rows; i++) {
  id = `cell-${rows}-${i}`;
  borders = ["bottom", "left", "right"];
  removeBorders(id, borders);
}

{
  a = 2;
  b = cols;
  for (let i = 1; i < centralCol - 1; i++) {
    for (let j = a; j < b; j++) {
      if (j != centralCol) {
        id = `cell-${i}-${j}`;
        borders = ["bottom", "left", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}

//Around the center
{
  id = `cell-${centralRow - 1}-${centralCol}`;
  borders = ["bottom", "left", "right"];
  removeBorders(id, borders);
}

{
  a = 2;
  b = cols - 1;
  for (let i = cols - 1; i > centralCol; i--) {
    for (let j = a; j < b; j++) {
      if (j != centralCol) {
        id = `cell-${i}-${j}`;
        borders = ["bottom", "left", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}

//////// BOTTOM-TOP-RIGHT
for (let i = 1; i < cols; i++) {
  id = `cell-${i}-${cols}`;
  borders = ["bottom", "top", "right"];
  removeBorders(id, borders);
}

{
  a = 2;
  b = rows;
  for (let i = 1; i < centralRow - 1; i++) {
    for (let j = a; j < b; j++) {
      if (j != centralRow) {
        id = `cell-${j}-${i}`;
        borders = ["bottom", "top", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}

//Around the center
{
  id = `cell-${centralRow}-${centralCol - 1}`;
  borders = ["bottom", "top", "right"];
  removeBorders(id, borders);
}

{
  a = 2;
  b = rows - 1;
  for (let i = cols - 1; i > centralRow; i--) {
    for (let j = a; j < b; j++) {
      if (j != centralRow) {
        id = `cell-${j}-${i}`;
        borders = ["bottom", "top", "right"];
        removeBorders(id, borders);
      }
    }
    a += 1;
    b -= 1;
  }
}
