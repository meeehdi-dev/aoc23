import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d18/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

enum Direction {
  Up = "U",
  Down = "D",
  Left = "L",
  Right = "R",
}

const instructions: {
  direction: Direction;
  count: number;
  direction2: Direction;
  count2: number;
}[] = [];
lines.forEach((line) => {
  if (!line) {
    return;
  }

  const [direction, count, color] = line.split(" ");
  const dir2 = color.slice(7, 8);
  const count2 = color.slice(2, 7);
  let direction2: Direction;
  switch (dir2) {
    case "0":
      direction2 = Direction.Up;
      break;
    case "1":
      direction2 = Direction.Down;
      break;
    case "2":
      direction2 = Direction.Left;
      break;
    case "3":
      direction2 = Direction.Up;
      break;
    default:
      throw new Error("Unknown direction");
  }
  instructions.push({
    direction: direction as Direction,
    count: Number(count),
    direction2: direction2 as Direction,
    count2: parseInt(count2, 16),
  });
});

const outline: Record<number, Record<number, boolean>> = {
  "-1": {
    "-1": false,
    0: false,
    "1": false,
  },
  "0": {
    "-1": false,
    "0": false,
    "1": false,
  },
  "1": {
    "-1": false,
    0: false,
    "1": false,
  },
};
let minRowIndex = Infinity;
let realMinRowIndex = Infinity;
let minColIndex = Infinity;
let realMaxRowIndex = -Infinity;
let maxColIndex = -Infinity;

const map: Record<number, { row: Record<number, true>; minCol: number }> = {
  "0": {
    minCol: 0,
    row: {
      "0": true,
    },
  },
};
let rowIndex = 0;
let colIndex = 0;
let currentDirection = instructions[0].direction2;
for (let i = 0; i < instructions.length; i++) {
  const { direction, count } = instructions[i];
  // const { direction2: direction, count2: count } = instructions[i];

  if (currentDirection !== direction) {
    if (currentDirection === Direction.Up) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!outline[rowIndex - 1]) {
        outline[rowIndex - 1] = {};
      }
      if (direction === Direction.Left) {
        outline[rowIndex - 1][colIndex + 1] = false;
      } else if (direction === Direction.Right) {
        outline[rowIndex - 1][colIndex - 1] = false;
      }
    } else if (currentDirection === Direction.Right) {
      if (direction === Direction.Up) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!outline[rowIndex + 1]) {
          outline[rowIndex + 1] = {};
        }
        outline[rowIndex + 1][colIndex + 1] = false;
      } else if (direction === Direction.Down) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!outline[rowIndex - 1]) {
          outline[rowIndex - 1] = {};
        }
        outline[rowIndex - 1][colIndex + 1] = false;
      }
    } else if (currentDirection === Direction.Down) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!outline[rowIndex + 1]) {
        outline[rowIndex + 1] = {};
      }
      if (direction === Direction.Left) {
        outline[rowIndex + 1][colIndex + 1] = false;
      } else if (direction === Direction.Right) {
        outline[rowIndex + 1][colIndex - 1] = false;
      }
    } else {
      if (direction === Direction.Up) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!outline[rowIndex + 1]) {
          outline[rowIndex + 1] = {};
        }
        outline[rowIndex + 1][colIndex - 1] = false;
      } else if (direction === Direction.Down) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!outline[rowIndex - 1]) {
          outline[rowIndex - 1] = {};
        }
        outline[rowIndex - 1][colIndex - 1] = false;
      }
    }

    currentDirection = direction;
  }

  for (let j = 0; j < count; j++) {
    if (direction === Direction.Up) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!outline[rowIndex]) {
        outline[rowIndex] = {};
      }
      outline[rowIndex][colIndex - 1] = false;
      outline[rowIndex][colIndex + 1] = false;
      rowIndex--;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!outline[rowIndex]) {
        outline[rowIndex] = {};
      }
      outline[rowIndex][colIndex - 1] = false;
      outline[rowIndex][colIndex + 1] = false;
    } else if (direction === Direction.Down) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!outline[rowIndex]) {
        outline[rowIndex] = {};
      }
      outline[rowIndex][colIndex - 1] = false;
      outline[rowIndex][colIndex + 1] = false;
      rowIndex++;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!outline[rowIndex]) {
        outline[rowIndex] = {};
      }
      outline[rowIndex][colIndex - 1] = false;
      outline[rowIndex][colIndex + 1] = false;
    } else if (direction === Direction.Left) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!outline[rowIndex - 1]) {
        outline[rowIndex - 1] = {};
      }
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!outline[rowIndex + 1]) {
        outline[rowIndex + 1] = {};
      }
      outline[rowIndex - 1][colIndex] = false;
      outline[rowIndex + 1][colIndex] = false;
      colIndex--;
      outline[rowIndex - 1][colIndex] = false;
      outline[rowIndex + 1][colIndex] = false;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!outline[rowIndex - 1]) {
        outline[rowIndex - 1] = {};
      }
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!outline[rowIndex + 1]) {
        outline[rowIndex + 1] = {};
      }
      outline[rowIndex - 1][colIndex] = false;
      outline[rowIndex + 1][colIndex] = false;
      colIndex++;
      outline[rowIndex - 1][colIndex] = false;
      outline[rowIndex + 1][colIndex] = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!map[rowIndex]) {
      map[rowIndex] = { minCol: Infinity, row: {} };
    }
    map[rowIndex].row[colIndex] = true;
    if (map[rowIndex].minCol > colIndex) {
      map[rowIndex].minCol = colIndex;
    }

    if (colIndex < minColIndex) {
      minColIndex = colIndex;
      minRowIndex = rowIndex;
    }
    if (colIndex > maxColIndex) {
      maxColIndex = colIndex;
    }
    if (rowIndex < realMinRowIndex) {
      realMinRowIndex = rowIndex;
    }
    if (rowIndex > realMaxRowIndex) {
      realMaxRowIndex = rowIndex;
    }
  }
}

const toVisitOutline: Record<number, [number, number]> = {
  0: [minRowIndex, minColIndex],
};
let visitOutlineIndex = 0;
let visitOutlineCount = 1;
while (visitOutlineIndex < visitOutlineCount) {
  const visit = toVisitOutline[visitOutlineIndex++];
  const [rowIndex, colIndex] = visit;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const up = outline[rowIndex - 1]?.[colIndex];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-unnecessary-boolean-literal-compare
  if (up === false && !map[rowIndex - 1]?.row[colIndex]) {
    outline[rowIndex - 1][colIndex] = true;
    toVisitOutline[visitOutlineCount++] = [rowIndex - 1, colIndex];
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const down = outline[rowIndex + 1]?.[colIndex];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-unnecessary-boolean-literal-compare
  if (down === false && !map[rowIndex + 1]?.row[colIndex]) {
    outline[rowIndex + 1][colIndex] = true;
    toVisitOutline[visitOutlineCount++] = [rowIndex + 1, colIndex];
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const left = outline[rowIndex]?.[colIndex - 1];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-unnecessary-boolean-literal-compare
  if (left === false && !map[rowIndex]?.row[colIndex - 1]) {
    outline[rowIndex][colIndex - 1] = true;
    toVisitOutline[visitOutlineCount++] = [rowIndex, colIndex - 1];
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const right = outline[rowIndex]?.[colIndex + 1];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-unnecessary-boolean-literal-compare
  if (right === false && !map[rowIndex]?.row[colIndex + 1]) {
    outline[rowIndex][colIndex + 1] = true;
    toVisitOutline[visitOutlineCount++] = [rowIndex, colIndex + 1];
  }
}

rowIndex = realMinRowIndex - 1;
colIndex = minColIndex - 1;
let inside = false;
let wasOutside = false;
while (rowIndex < realMaxRowIndex + 1 && colIndex < maxColIndex + 1) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (map[rowIndex]?.minCol > colIndex) {
    colIndex = map[rowIndex].minCol - 1;
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const outside = outline[rowIndex]?.[colIndex];
  if (outside) {
    inside = false;
    wasOutside = true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (wasOutside && !outside && map[rowIndex]?.row[colIndex]) {
    inside = true;
    wasOutside = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (inside || map[rowIndex]?.row[colIndex]) {
    part1++;
  }

  colIndex++;
  if (colIndex === maxColIndex + 1) {
    rowIndex++;
    colIndex = minColIndex - 1;
    inside = false;
    wasOutside = false;
    continue;
  }
}

part1 += 0;
part2 += 0;

console.log(part1, part2);

console.timeEnd("");
