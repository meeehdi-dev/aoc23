import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d17/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const map: Record<number, Record<number, number>> = {};
lines.forEach((row, rowIndex) => {
  if (!row) {
    return;
  }

  map[rowIndex] = {};
  row.split("").forEach((col, colIndex) => {
    map[rowIndex][colIndex] = Number(col);
  });
});
const target = [Object.keys(map).length - 1, Object.keys(map[0]).length - 1];

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const travel = (minStraight: number, maxStraight: number) => {
  const visited: Record<string, { straight: number; loss: number }> = {};
  const toVisit: Record<
    number,
    {
      rowIndex: number;
      colIndex: number;
      loss: number;
      straight: number;
      direction: Direction;
    }
  > = {
    0: {
      rowIndex: 0,
      colIndex: 0,
      loss: 0,
      straight: 1,
      direction: Direction.Right,
    },
    1: {
      rowIndex: 0,
      colIndex: 0,
      loss: 0,
      straight: 1,
      direction: Direction.Down,
    },
  };

  let minLoss = Infinity;
  let visitIndex = 0;
  let visitCount = 2;
  while (visitIndex < visitCount) {
    const current = toVisit[visitIndex++];

    const { rowIndex, colIndex, loss, straight, direction } = current;

    if (rowIndex === target[0] && colIndex === target[1]) {
      if (
        straight >= minStraight &&
        straight <= maxStraight &&
        loss < minLoss
      ) {
        minLoss = loss;
      }
      continue;
    }

    const key = `${rowIndex},${colIndex},${direction}`;
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      visited[key] &&
      straight >= minStraight &&
      visited[key].straight <= straight &&
      visited[key].loss <= loss
    ) {
      continue;
    }
    if ((rowIndex !== 0 || colIndex !== 0) && straight >= minStraight) {
      visited[key] = {
        straight,
        loss,
      };
    }

    if (straight >= minStraight) {
      if (direction === Direction.Up || direction === Direction.Down) {
        const left = map[rowIndex][colIndex - 1];
        if (left) {
          toVisit[visitCount++] = {
            rowIndex,
            colIndex: colIndex - 1,
            loss: loss + left,
            straight: 1,
            direction: Direction.Left,
          };
        }
        const right = map[rowIndex][colIndex + 1];
        if (right) {
          toVisit[visitCount++] = {
            rowIndex,
            colIndex: colIndex + 1,
            loss: loss + right,
            straight: 1,
            direction: Direction.Right,
          };
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const up = map[rowIndex - 1]?.[colIndex];
        if (up) {
          toVisit[visitCount++] = {
            rowIndex: rowIndex - 1,
            colIndex,
            loss: loss + up,
            straight: 1,
            direction: Direction.Up,
          };
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const down = map[rowIndex + 1]?.[colIndex];
        if (down) {
          toVisit[visitCount++] = {
            rowIndex: rowIndex + 1,
            colIndex,
            loss: loss + down,
            straight: 1,
            direction: Direction.Down,
          };
        }
      }
    }
    if (straight < maxStraight) {
      if (direction === Direction.Up) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const next = map[rowIndex - 1]?.[colIndex];
        if (next) {
          toVisit[visitCount++] = {
            rowIndex: rowIndex - 1,
            colIndex,
            loss: loss + next,
            straight: straight + 1,
            direction: Direction.Up,
          };
        }
      } else if (direction === Direction.Down) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const next = map[rowIndex + 1]?.[colIndex];
        if (next) {
          toVisit[visitCount++] = {
            rowIndex: rowIndex + 1,
            colIndex,
            loss: loss + next,
            straight: straight + 1,
            direction: Direction.Down,
          };
        }
      } else if (direction === Direction.Left) {
        const next = map[rowIndex][colIndex - 1];
        if (next) {
          toVisit[visitCount++] = {
            rowIndex,
            colIndex: colIndex - 1,
            loss: loss + next,
            straight: straight + 1,
            direction: Direction.Left,
          };
        }
      } else {
        const next = map[rowIndex][colIndex + 1];
        if (next) {
          toVisit[visitCount++] = {
            rowIndex,
            colIndex: colIndex + 1,
            loss: loss + next,
            straight: straight + 1,
            direction: Direction.Right,
          };
        }
      }
    }
  }

  return minLoss;
};

part1 += travel(1, 3);
part2 += travel(4, 10);

console.log(part1, part2);

console.timeEnd("");
