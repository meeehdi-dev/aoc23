import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d14/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const rocksMap: string[][] = [];
lines.forEach((row, rowIndex) => {
  if (!row) {
    return;
  }

  const rocks = row.split("");
  rocksMap[rowIndex] = [];
  rocks.forEach((rock, index) => {
    rocksMap[rowIndex][index] = rock;
  });
});

const getWeight = (): number => {
  let weight = 0;
  const totalRows = rocksMap.length;
  rocksMap.forEach((rocks, rowIndex) => {
    let count = 0;
    rocks.forEach((rock) => {
      if (rock === "O") {
        count++;
      }
    });
    const mul = totalRows - rowIndex;
    weight += count * mul;
  });

  return weight;
};

const tiltNorth = (): void => {
  const northestRocks: number[] = rocksMap.map(() => 0);
  let rowIndex = 0;
  let colIndex = 0;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const rock = rocksMap[rowIndex][colIndex];

    if (rock === "#") {
      northestRocks[colIndex] = rowIndex + 1;
    } else if (rock === "O") {
      const northest = northestRocks[colIndex];
      northestRocks[colIndex]++;
      rocksMap[rowIndex][colIndex] = ".";
      rocksMap[northest][colIndex] = "O";
    }

    colIndex++;
    if (colIndex >= rocksMap[0].length) {
      colIndex = 0;
      rowIndex++;
    }

    if (rowIndex >= rocksMap.length) {
      break;
    }
  }
};
const tiltWest = (): void => {
  const westestRocks: number[] = rocksMap[0].map(() => 0);
  let rowIndex = 0;
  let colIndex = 0;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const rock = rocksMap[rowIndex][colIndex];

    if (rock === "#") {
      westestRocks[rowIndex] = colIndex + 1;
    } else if (rock === "O") {
      const westest = westestRocks[rowIndex];
      westestRocks[rowIndex]++;
      rocksMap[rowIndex][colIndex] = ".";
      rocksMap[rowIndex][westest] = "O";
    }

    rowIndex++;
    if (rowIndex >= rocksMap.length) {
      rowIndex = 0;
      colIndex++;
    }

    if (colIndex >= rocksMap[0].length) {
      break;
    }
  }
};
const tiltSouth = (): void => {
  const southestRocks: number[] = rocksMap.map(() => rocksMap.length - 1);
  let rowIndex = rocksMap.length - 1;
  let colIndex = 0;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const rock = rocksMap[rowIndex][colIndex];

    if (rock === "#") {
      southestRocks[colIndex] = rowIndex - 1;
    } else if (rock === "O") {
      const southest = southestRocks[colIndex];
      southestRocks[colIndex]--;
      rocksMap[rowIndex][colIndex] = ".";
      rocksMap[southest][colIndex] = "O";
    }

    colIndex++;
    if (colIndex >= rocksMap[0].length) {
      colIndex = 0;
      rowIndex--;
    }

    if (rowIndex < 0) {
      break;
    }
  }
};
const tiltEast = (): void => {
  const eastestRocks: number[] = rocksMap[0].map(() => rocksMap[0].length - 1);
  let rowIndex = 0;
  let colIndex = rocksMap[0].length - 1;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const rock = rocksMap[rowIndex][colIndex];

    if (rock === "#") {
      eastestRocks[rowIndex] = colIndex - 1;
    } else if (rock === "O") {
      const eastest = eastestRocks[rowIndex];
      eastestRocks[rowIndex]--;
      rocksMap[rowIndex][colIndex] = ".";
      rocksMap[rowIndex][eastest] = "O";
    }

    rowIndex++;
    if (rowIndex >= rocksMap.length) {
      rowIndex = 0;
      colIndex--;
    }

    if (colIndex < 0) {
      break;
    }
  }
};

{
  tiltNorth();

  part1 += getWeight();
}

{
  const dup: Record<string, number> = {};
  for (let i = 0; i < 1_000_000_000; i++) {
    tiltNorth();
    tiltWest();
    tiltSouth();
    tiltEast();
    const map = rocksMap.map((rocks) => rocks.join("")).join("");
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (dup[map]) {
      if ((1_000_000_000 - 1 - i) % (i - dup[map]) === 0) {
        break;
      }
    } else {
      dup[map] = i;
    }
  }

  part2 += getWeight();
}

console.log(part1, part2);

console.timeEnd("");
