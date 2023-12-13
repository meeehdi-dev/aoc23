import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d12/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const replace = (record: string, index: number, char: string) => {
  return record.slice(0, index) + char + record.slice(index + 1);
};

let records: Record<string, true> = {};
const rec = (
  record: string,
  counts: number[],
  missing: number,
  idx: number,
): number => {
  let c = 0;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (records[record]) {
    return c;
  }
  records[record] = true;
  record = record.slice(0);
  const unknown = record.split("").filter((r) => r === "?").length;
  if (unknown < missing) {
    return c;
  }
  const groups = record.split(".").filter((r) => r.length > 0);
  if (groups.length === counts.length) {
    let valid = true;
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].length !== counts[i]) {
        valid = false;
        break;
      }
    }
    if (valid) {
      c++;
    }
  }
  for (let i = 0; i < record.length; i++) {
    if (record[i] === "?") {
      record = replace(record, i, ".");
      c += rec(record, counts, missing, idx);
      record = replace(record, i, "?");
    }
  }
  return c;
};

lines.forEach((line, index) => {
  records = {};
  if (!line) {
    return;
  }

  const [record, countsStr] = line.split(" ");
  const counts = countsStr.split(",").map(Number);
  const total = counts.reduce((acc, b) => acc + b, 0);
  const existing = record.split("").filter((r) => r === "#").length;
  const missing = total - existing;
  part1 += rec(record, counts, missing, index);
});

part2 += 0;

console.log(part1, part2);

console.timeEnd("");
