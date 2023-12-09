import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d09/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

lines.forEach((line) => {
  if (!line) {
    return;
  }

  const steps = line.split(" ").map(Number);
  const diffs: Record<number, number[] | undefined> = {};
  let maxLevel = 0;
  for (let i = 0; i < steps.length - 1; i++) {
    let diff = steps[i + 1] - steps[i];
    let level = 0;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      if (level > maxLevel) {
        maxLevel = level;
      }
      const levelDiffs = diffs[level];
      if (levelDiffs === undefined) {
        diffs[level] = [diff];
        break;
      }
      const lastDiff = levelDiffs[levelDiffs.length - 1];
      levelDiffs.push(diff);
      if (lastDiff === 0 && diff === 0) {
        break;
      } else {
        diff = diff - lastDiff;
        ++level;
      }
    }
  }

  let diff1 = 0;
  let diff2 = 0;
  for (let i = maxLevel; i >= 0; i--) {
    const levelDiffs = diffs[i];
    if (levelDiffs === undefined) {
      continue;
    }
    diff1 += levelDiffs[levelDiffs.length - 1];
    diff2 = levelDiffs[0] - diff2;
  }

  part1 += steps[steps.length - 1] + diff1;
  part2 += steps[0] - diff2;
});

console.log(part1, part2);

console.timeEnd("");
