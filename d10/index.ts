import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d10/example4.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const map: Record<number, Record<number, string> | undefined> = {};
let start: [number, number] = [0, 0];
lines.forEach((line, rowIndex) => {
  if (!line) {
    return;
  }

  const row: Record<string, string> = {};
  const cols = line.split("");
  cols.forEach((col, colIndex) => {
    row[colIndex] = col;
    if (col === "S") {
      start = [rowIndex, colIndex];
    }
  });
  map[rowIndex] = row;
});

const south = ["|", "7", "F"];
const north = ["|", "L", "J"];
const west = ["-", "J", "7"];
const east = ["-", "L", "F"];

type Direction = "up" | "down" | "left" | "right" | "";

let prev1: Direction = "";
let prev2: Direction = "";
let current1: [number, number] = [...start];
let current2: [number, number] = [...start];
let checked1: boolean = false;
let dist1 = 0;
let dist2 = 0;

const loop: Record<string, boolean> = {};

const [rowIndex, colIndex] = start;
loop[`${rowIndex},${colIndex}`] = true;
const up = map[rowIndex - 1]?.[colIndex];
const down = map[rowIndex + 1]?.[colIndex];
const left = map[rowIndex]?.[colIndex - 1];
const right = map[rowIndex]?.[colIndex + 1];
if (up && south.includes(up)) {
  checked1 = true;
  current1[0] = rowIndex - 1;
  prev1 = "up";
  dist1++;
}
if (down && north.includes(down)) {
  if (!checked1) {
    checked1 = true;
    current1[0] = rowIndex + 1;
    prev1 = "down";
    dist1++;
  } else {
    current2[0] = rowIndex + 1;
    prev2 = "down";
    dist2++;
  }
}
if (left && east.includes(left)) {
  if (!checked1) {
    checked1 = true;
    current1[1] = colIndex - 1;
    prev1 = "left";
    dist1++;
  } else {
    current2[1] = colIndex - 1;
    prev2 = "left";
    dist2++;
  }
}
if (right && west.includes(right)) {
  if (!checked1) {
    checked1 = true;
    current1[1] = colIndex + 1;
    prev1 = "right";
    dist1++;
  } else {
    current2[1] = colIndex + 1;
    prev2 = "right";
    dist2++;
  }
}
const [rowIndex1, colIndex1] = current1;
const [rowIndex2, colIndex2] = current2;
loop[`${rowIndex1},${colIndex1}`] = true;
loop[`${rowIndex2},${colIndex2}`] = true;

const move = (
  current: [number, number],
  prev: Direction,
): [[number, number], Direction] => {
  const [rowIndex, colIndex] = current;
  const cell = map[rowIndex]?.[colIndex];
  if (!cell) {
    return [current, prev];
  }

  if (cell === "|") {
    return [[rowIndex + (prev === "up" ? -1 : 1), colIndex], prev];
  } else if (cell === "-") {
    return [[rowIndex, colIndex + (prev === "left" ? -1 : 1)], prev];
  } else if (cell === "L") {
    if (prev === "left") {
      return [[rowIndex - 1, colIndex], "up"];
    } else if (prev === "down") {
      return [[rowIndex, colIndex + 1], "right"];
    }
  } else if (cell === "J") {
    if (prev === "right") {
      return [[rowIndex - 1, colIndex], "up"];
    } else if (prev === "down") {
      return [[rowIndex, colIndex - 1], "left"];
    }
  } else if (cell === "7") {
    if (prev === "up") {
      return [[rowIndex, colIndex - 1], "left"];
    } else if (prev === "right") {
      return [[rowIndex + 1, colIndex], "down"];
    }
  } else if (cell === "F") {
    if (prev === "left") {
      return [[rowIndex + 1, colIndex], "down"];
    } else if (prev === "up") {
      return [[rowIndex, colIndex + 1], "right"];
    }
  }

  return [current, prev];
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
while (true) {
  [current1, prev1] = move(current1, prev1);
  loop[`${current1[0]},${current1[1]}`] = true;
  dist1++;

  const [rowIndex1, colIndex1] = current1;
  {
    const [rowIndex2, colIndex2] = current2;
    if (rowIndex2 === rowIndex1 && colIndex2 === colIndex1) {
      break;
    }
  }

  [current2, prev2] = move(current2, prev2);
  loop[`${current2[0]},${current2[1]}`] = true;
  dist2++;

  {
    const [rowIndex2, colIndex2] = current2;
    if (rowIndex2 === rowIndex1 && colIndex2 === colIndex1) {
      break;
    }
  }
}

part1 += Math.max(dist1, dist2);

const rows = Object.values(map);
// prepare outside
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  if (!row) {
    continue;
  }
  const cols = Object.values(row);
  for (let j = 0; j < cols.length; j++) {
    if (
      !loop[`${i},${j}`] &&
      (i === 0 || i === rows.length - 1 || j === 0 || j === cols.length - 1)
    ) {
      row[j] = "O";
    }
  }
}

const visited: string[] = [];
const flood = (i: number, j: number): void => {
  if (visited.includes(`${i},${j}`) || i < 0 || i >= rows.length) {
    return;
  }
  const row = rows[i];
  if (!row || j < 0 || j >= Object.keys(row).length) {
    return;
  }
  if (!loop[`${i},${j}`]) {
    visited.push(`${i},${j}`);
    row[j] = "O";
    flood(i - 1, j);
    flood(i + 1, j);
    flood(i, j - 1);
    flood(i, j + 1);
  }
};

// flood fill
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  if (!row) {
    continue;
  }
  const cols = Object.values(row);
  for (let j = 0; j < cols.length; j++) {
    const col = cols[j];

    if (col === "O") {
      flood(i, j);
    }
  }
}

// check inside
let inside = false;
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  if (!row) {
    continue;
  }
  const cols = Object.values(row);
  for (let j = 0; j < cols.length; j++) {
    if (loop[`${i},${j}`]) {
      inside = !inside;
    } else if (!visited.includes(`${i},${j}`)) {
      row[j] = "I";
      part2++;
    }
  }
}

console.log(part1, part2);

console.timeEnd("");
