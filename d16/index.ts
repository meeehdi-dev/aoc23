import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d16/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const map: Record<number, Record<number, string>> = {};
lines.forEach((row, rowIndex) => {
  if (!row) {
    return;
  }

  const cols = row.split("");
  cols.forEach((col, colIndex) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!map[rowIndex]) {
      map[rowIndex] = {};
    }
    map[rowIndex][colIndex] = col;
  });
});

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const travel = (
  rowIndex: number,
  colIndex: number,
  direction: Direction,
  energized: Record<number, Record<number, true>>,
  vertical: Record<number, Record<number, true>>,
  horizontal: Record<number, Record<number, true>>,
) => {
  let stop = false;
  while (!stop) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    stop = !map[rowIndex] || !map[rowIndex][colIndex];
    if (stop) {
      break;
    }

    const col = map[rowIndex][colIndex];

    if (col === ".") {
      if (direction === Direction.Up || direction === Direction.Down) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!vertical[rowIndex]) {
          vertical[rowIndex] = {};
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (vertical[rowIndex][colIndex]) {
          break;
        } else {
          vertical[rowIndex][colIndex] = true;
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!horizontal[rowIndex]) {
          horizontal[rowIndex] = {};
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (horizontal[rowIndex][colIndex]) {
          break;
        } else {
          horizontal[rowIndex][colIndex] = true;
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!energized[rowIndex]) {
      energized[rowIndex] = {};
    }
    energized[rowIndex][colIndex] = true;

    switch (col) {
      case "\\":
        if (direction === Direction.Right) {
          direction = Direction.Down;
        } else if (direction === Direction.Left) {
          direction = Direction.Up;
        } else if (direction === Direction.Up) {
          direction = Direction.Left;
        } else {
          direction = Direction.Right;
        }
        break;
      case "/":
        if (direction === Direction.Right) {
          direction = Direction.Up;
        } else if (direction === Direction.Left) {
          direction = Direction.Down;
        } else if (direction === Direction.Up) {
          direction = Direction.Right;
        } else {
          direction = Direction.Left;
        }
        break;
      case "|":
        if (direction === Direction.Up) {
          direction = Direction.Up;
        } else if (direction === Direction.Down) {
          direction = Direction.Down;
        } else {
          travel(
            rowIndex - 1,
            colIndex,
            Direction.Up,
            energized,
            vertical,
            horizontal,
          );
          travel(
            rowIndex + 1,
            colIndex,
            Direction.Down,
            energized,
            vertical,
            horizontal,
          );
          stop = true;
        }
        break;
      case "-":
        if (direction === Direction.Left) {
          direction = Direction.Left;
        } else if (direction === Direction.Right) {
          direction = Direction.Right;
        } else {
          travel(
            rowIndex,
            colIndex - 1,
            Direction.Left,
            energized,
            vertical,
            horizontal,
          );
          travel(
            rowIndex,
            colIndex + 1,
            Direction.Right,
            energized,
            vertical,
            horizontal,
          );
          stop = true;
        }
        break;
    }

    if (!stop) {
      switch (direction) {
        case Direction.Up:
          rowIndex--;
          break;
        case Direction.Down:
          rowIndex++;
          break;
        case Direction.Left:
          colIndex--;
          break;
        case Direction.Right:
          colIndex++;
          break;
      }
    }
  }
};

const getEnergy = (energized: Record<number, Record<number, true>>) => {
  let energy = 0;
  Object.values(energized).forEach((row) => {
    Object.values(row).forEach(() => {
      energy++;
    });
  });
  return energy;
};

const startTravel = (
  rowIndex: number,
  colIndex: number,
  direction: Direction,
): number => {
  const e: Record<number, Record<number, true>> = {};
  const v: Record<number, Record<number, true>> = {};
  const h: Record<number, Record<number, true>> = {};
  travel(rowIndex, colIndex, direction, e, v, h);
  const energy = getEnergy(e);
  return energy;
};

part1 += startTravel(0, 0, Direction.Right);

const rows = Object.keys(map).length;
const cols = Object.keys(map[0]).length;
let maxEnergy = -1;
for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
  for (let colIndex = 0; colIndex < cols; colIndex++) {
    if (rowIndex === 0) {
      maxEnergy = Math.max(
        maxEnergy,
        startTravel(rowIndex, colIndex, Direction.Down),
      );
    }
    if (rowIndex === rows - 1) {
      maxEnergy = Math.max(
        maxEnergy,
        startTravel(rowIndex, colIndex, Direction.Up),
      );
    }
    if (colIndex === 0) {
      maxEnergy = Math.max(
        maxEnergy,
        startTravel(rowIndex, colIndex, Direction.Right),
      );
    }
    if (colIndex === cols - 1) {
      maxEnergy = Math.max(
        maxEnergy,
        startTravel(rowIndex, colIndex, Direction.Left),
      );
    }
  }
}

part2 += maxEnergy;

console.log(part1, part2);

console.timeEnd("");
