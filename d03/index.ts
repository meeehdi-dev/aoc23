import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d03/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const numberRegex = /\d+/g;
const symbolRegex = /[^\d.]/g;

const numbersMap: Record<string, { value: number; adjacents: string[] }> = {};
const symbolMap: Record<string, { value: string }> = {};
lines.forEach((line, index) => {
  if (!line) {
    return;
  }
  const numbers = line.matchAll(numberRegex);
  const symbols = line.matchAll(symbolRegex);
  for (const number of numbers) {
    if (number.index === undefined) {
      continue;
    }

    const match = number[0];
    const matchLen = match.length;
    const adjacents: string[] = [];
    for (let i = -1; i <= matchLen; i++) {
      adjacents.push([index - 1, number.index + i].join("_"));
      adjacents.push([index, number.index + i].join("_"));
      adjacents.push([index + 1, number.index + i].join("_"));
    }
    const filteredAdjacents = adjacents.filter((n) => !n.includes("-"));
    numbersMap[[index, number.index].join("_")] = {
      value: Number(match),
      adjacents: filteredAdjacents,
    };
  }
  for (const symbol of symbols) {
    if (symbol.index === undefined) {
      continue;
    }

    const match = symbol[0];
    symbolMap[[index, symbol.index].join("_")] = { value: match };
  }
});

part1 += Object.entries(numbersMap).reduce((acc, [, value]) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!value.adjacents.some((adj) => symbolMap[adj] !== undefined)) {
    return acc;
  }

  return acc + value.value;
}, 0);

part2 += Object.entries(symbolMap)
  .filter(([, value]) => value.value === "*")
  .reduce((acc, [key]) => {
    const adjacentNumbers = Object.entries(numbersMap)
      .filter(([, value]) => value.adjacents.includes(key))
      .map(([, value]) => value.value);
    if (adjacentNumbers.length !== 2) {
      return acc;
    }

    return acc + adjacentNumbers[0] * adjacentNumbers[1];
  }, 0);

console.log(part1, part2);

console.timeEnd("");
