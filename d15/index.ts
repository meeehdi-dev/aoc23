import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d15/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const getHash = (str: string) => {
  let val = 0;
  str.split("").forEach((char) => {
    const n = char.charCodeAt(0);
    val += n;
    val *= 17;
    val %= 256;
  });
  return val;
};

const boxes: Record<string, Record<string, number>> = {};
lines.forEach((line) => {
  if (!line) {
    return;
  }

  line.split(",").forEach((seq) => {
    const val = getHash(seq);
    if (seq[seq.length - 1] === "-") {
      const [lens] = seq.split("-");
      const box = getHash(lens);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (boxes[box]) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete boxes[box][lens];
      }
    } else {
      const [lens, focal] = seq.split("=");
      const box = getHash(lens);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!boxes[box]) {
        boxes[box] = {};
      }
      boxes[box][lens] = Number(focal);
    }
    part1 += val;
  });
  Object.entries(boxes).forEach(([box, lenses]) => {
    Object.entries(lenses).forEach(([, focal], index) => {
      part2 += (Number(box) + 1) * (index + 1) * focal;
    });
  });
});

console.log(part1, part2);

console.timeEnd("");
