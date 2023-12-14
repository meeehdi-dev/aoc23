import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d13/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

type Pattern = { rows: string[]; cols: string[] };

const getSymmetryLocations = (
  pattern: Pattern,
  oldColMirror: number,
  oldRowMirror: number,
): [number, number] => {
  let rowMirror = -1;
  for (let i = 0; i < pattern.rows.length - 1; i++) {
    if (i + 1 !== oldRowMirror && pattern.rows[i] === pattern.rows[i + 1]) {
      rowMirror = i + 1;
      for (let j = 1; i - j >= 0 && i + 1 + j < pattern.rows.length; j++) {
        if (pattern.rows[i - j] !== pattern.rows[i + 1 + j]) {
          rowMirror = -1;
          break;
        }
      }
    }
    if (rowMirror >= 0) {
      break;
    }
  }
  let colMirror = -1;
  for (let i = 0; i < pattern.cols.length - 1; i++) {
    if (i + 1 !== oldColMirror && pattern.cols[i] === pattern.cols[i + 1]) {
      colMirror = i + 1;
      for (let j = 1; i - j >= 0 && i + 1 + j < pattern.cols.length; j++) {
        if (pattern.cols[i - j] !== pattern.cols[i + 1 + j]) {
          colMirror = -1;
          break;
        }
      }
    }
    if (colMirror >= 0) {
      break;
    }
  }
  return [colMirror, rowMirror];
};
const getSymmetryScore = (colMirror: number, rowMirror: number) =>
  (colMirror > 0 ? colMirror : 0) + (rowMirror > 0 ? rowMirror * 100 : 0);

let currentPattern: Pattern = { rows: [], cols: [] };
lines.forEach((line) => {
  if (!line) {
    const [colMirror, rowMirror] = getSymmetryLocations(currentPattern, -1, -1);
    part1 += getSymmetryScore(colMirror, rowMirror);
    for (let i = 0; i < currentPattern.rows.length; i++) {
      for (let j = 0; j < currentPattern.cols.length; j++) {
        if (currentPattern.rows[i][j] === "#") {
          currentPattern.rows[i] =
            currentPattern.rows[i].slice(0, j) +
            "." +
            currentPattern.rows[i].slice(j + 1);
          currentPattern.cols[j] =
            currentPattern.cols[j].slice(0, i) +
            "." +
            currentPattern.cols[j].slice(i + 1);
          const [colMirror2, rowMirror2] = getSymmetryLocations(
            currentPattern,
            colMirror,
            rowMirror,
          );
          part2 += getSymmetryScore(colMirror2, rowMirror2);
          currentPattern.rows[i] =
            currentPattern.rows[i].slice(0, j) +
            "#" +
            currentPattern.rows[i].slice(j + 1);
          currentPattern.cols[j] =
            currentPattern.cols[j].slice(0, i) +
            "#" +
            currentPattern.cols[j].slice(i + 1);
        }
      }
    }
    currentPattern = { rows: [], cols: [] };
    return;
  }

  currentPattern.rows.push(line);
  for (let i = 0; i < line.length; i++) {
    if (!currentPattern.cols[i]) {
      currentPattern.cols[i] = "";
    }
    currentPattern.cols[i] += line[i];
  }
});

part1 += 0;
part2 += 0;

console.log(part1, part2);

console.timeEnd("");
