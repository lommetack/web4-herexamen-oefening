/**
 * Count the amount of surrounding cells that are alive
 *
 * @param {Number} size The amount of cells in a row (or column) It is a square grid
 * @param {Array} allCells An array of booleans representing the state of each cell
 * @param {Number} currentCellIndex The index of the cell we are checking
 * @returns {Number} The amount of surrounding cells that are alive
 */
const countSurrounding = (size, allCells, currentCellIndex) => {
  let count = 0;

  // Thank you, copilot...

  // Check left
  if (currentCellIndex % size !== 0 && allCells[currentCellIndex - 1]) count++;
  // Check right
  if (currentCellIndex % size !== size - 1 && allCells[currentCellIndex + 1])
    count++;
  // Check top
  if (currentCellIndex >= size && allCells[currentCellIndex - size]) count++;
  // Check bottom
  if (
    currentCellIndex < size * size - size &&
    allCells[currentCellIndex + size]
  )
    count++;
  // Check top left
  if (
    currentCellIndex >= size &&
    currentCellIndex % size !== 0 &&
    allCells[currentCellIndex - size - 1]
  )
    count++;
  // Check top right
  if (
    currentCellIndex >= size &&
    currentCellIndex % size !== size - 1 &&
    allCells[currentCellIndex - size + 1]
  )
    count++;
  // Check bottom left
  if (
    currentCellIndex < size * size - size &&
    currentCellIndex % size !== 0 &&
    allCells[currentCellIndex + size - 1]
  )
    count++;
  // Check bottom right
  if (
    currentCellIndex < size * size - size &&
    currentCellIndex % size !== size - 1 &&
    allCells[currentCellIndex + size + 1]
  ) {
    count++;
  }

  return count;
};

export { countSurrounding };
