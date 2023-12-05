import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d04/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const winnings: Record<string, { count: number; values: string[] }> = {};
lines.forEach((line) => {
  if (!line) {
    return;
  }

  const [cardIdStr, cardStr] = line.split(": ");
  const [, cardId] = cardIdStr.split(" ").filter((s) => s !== "");
  const [winningStr, numbersStr] = cardStr.split(" | ");
  const winning = winningStr.split(" ").filter((s) => s !== "");
  const numbers = numbersStr.split(" ").filter((s) => s !== "");
  const values = numbers.filter((n) => winning.includes(n));
  winnings[cardId] = { values, count: 1 };
});

part1 += Object.entries(winnings).reduce(
  (acc, [, value]) =>
    acc +
    (value.values.length === 0 ? 0 : Math.pow(2, value.values.length - 1)),
  0,
);

Object.entries(winnings).forEach(([cardKey, value]) => {
  const cardId = Number(cardKey);
  for (let i = 1; i <= value.values.length; i++) {
    const next = winnings[cardId + i];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!next) {
      continue;
    }
    winnings[cardId + i].count += value.count;
  }
});
part2 += Object.values(winnings).reduce((acc, value) => {
  return acc + (1 + value.values.length * value.count);
}, 0);

console.log(part1, part2);

console.timeEnd("");
