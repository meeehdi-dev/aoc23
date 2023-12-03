import { readFileSync } from "fs-extra";

const digitsMap: Record<string, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
};
const strDigitsMap: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const reverseStrDigitsMap = Object.fromEntries(
  Object.entries(strDigitsMap).map(([k, v]) => [
    k.split("").reverse().join(""),
    v,
  ]),
);
const fullDigitsMap: Record<string, number> = {
  ...digitsMap,
  ...strDigitsMap,
};
const reverseFullDigitsMap: Record<string, number> = {
  ...digitsMap,
  ...reverseStrDigitsMap,
};
const digitsKeys = Object.keys(digitsMap);
const fullDigitsKeys = Object.keys(fullDigitsMap);
const reverseFullDigitsKeys = Object.keys(reverseFullDigitsMap);

const digitsRe = new RegExp(`(${digitsKeys.join("|")})`);
const fullDigitsRe = new RegExp(`(${fullDigitsKeys.join("|")})`);
const reverseFullDigitsRe = new RegExp(`(${reverseFullDigitsKeys.join("|")})`);

const input = readFileSync("d01/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;
lines.forEach((line) => {
  if (!line) {
    return;
  }
  const rLine = line.split("").reverse().join("");

  let p1Match1 = -1;
  let p1Match2 = -1;
  let p2Match1 = -1;
  let p2Match2 = -1;

  const digitsMatches = line.match(digitsRe);
  if (digitsMatches) {
    const match = digitsMatches[0];
    p1Match1 = digitsMap[match];
    p1Match2 = p1Match1;
  }
  const reverseDigitsMatches = rLine.match(digitsRe);
  if (reverseDigitsMatches) {
    const match = reverseDigitsMatches[0];
    p1Match2 = digitsMap[match];
  }

  const fullDigitsMatches = line.match(fullDigitsRe);
  if (fullDigitsMatches) {
    const match = fullDigitsMatches[0];
    p2Match1 = fullDigitsMap[match];
    p2Match2 = p2Match1;
  }
  const reverseFullDigitsMatches = rLine.match(reverseFullDigitsRe);
  if (reverseFullDigitsMatches) {
    const match = reverseFullDigitsMatches[0];
    p2Match2 = reverseFullDigitsMap[match];
  }

  if (p1Match1 >= 0 && p1Match2 >= 0) {
    const match = p1Match1 * 10 + p1Match2;
    part1 += match;
  }

  if (p2Match1 >= 0 && p2Match2 >= 0) {
    const match = p2Match1 * 10 + p2Match2;
    part2 += match;
  }
});

console.log(part1, part2);
