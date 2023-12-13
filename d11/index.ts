import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d11/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const expandingRows: number[] = [];
const expandingCols: number[] = [];

const galaxyCols: Record<number, number> = {};
lines.forEach((row, rowIndex) => {
  if (!row) {
    return;
  }

  let rowGalaxies = 0;
  const cols = row.split("");
  cols.forEach((col, colIndex) => {
    if (!galaxyCols[colIndex]) {
      galaxyCols[colIndex] = 0;
    }

    if (col === "#") {
      rowGalaxies++;
      galaxyCols[colIndex]++;
    }
  });
  if (rowGalaxies === 0) {
    expandingRows.push(rowIndex);
  }
});
Object.entries(galaxyCols).forEach(([col, count]) => {
  if (count === 0) {
    expandingCols.push(parseInt(col));
  }
});

const galaxies: [number, number][] = [];
const galaxies2: [number, number][] = [];
lines.forEach((row, rowIndex) => {
  if (!row) {
    return;
  }

  const cols = row.split("");
  cols.forEach((col, colIndex) => {
    if (col === "#") {
      const expandingRowsCount = expandingRows.filter(
        (r) => r < rowIndex,
      ).length;
      const expandingColsCount = expandingCols.filter(
        (c) => c < colIndex,
      ).length;
      galaxies.push([
        rowIndex + expandingRowsCount,
        colIndex + expandingColsCount,
      ]);
      galaxies2.push([
        rowIndex + expandingRowsCount * (1_000_000 - 1),
        colIndex + expandingColsCount * (1_000_000 - 1),
      ]);
    }
  });
});

for (let i = 0; i < galaxies.length; i++) {
  const a = galaxies[i];
  const a2 = galaxies2[i];
  for (let j = i + 1; j < galaxies.length; j++) {
    const b = galaxies[j];
    const b2 = galaxies2[j];
    const dist = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    const dist2 = Math.abs(a2[0] - b2[0]) + Math.abs(a2[1] - b2[1]);
    part1 += dist;
    part2 += dist2;
  }
}

console.log(part1, part2);

console.timeEnd("");
