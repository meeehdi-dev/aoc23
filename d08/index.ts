import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d08/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const instructions = lines[0];

type Node = {
  value: string;
  L: Node | null;
  R: Node | null;
  steps: 0;
};
const map: Record<string, Node> = {};
const sources: string[] = [];

lines.slice(2).forEach((line) => {
  if (!line) {
    return;
  }

  const [source, destination] = line.split(" = ");
  const [L, R] = destination.slice(1, -1).split(", ");

  const lNode: Node | null =
    L === source
      ? null
      : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        map[L] || {
          value: L,
          L: null,
          R: null,
          steps: 0,
        };
  const rNode: Node | null =
    R === source
      ? null
      : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        map[R] || {
          value: R,
          L: null,
          R: null,
          steps: 0,
        };
  const node: Node = {
    value: source,
    L: lNode,
    R: rNode,
    steps: 0,
  };
  Object.values(map).forEach((n) => {
    if (n.L?.value === source) {
      n.L = node;
    }
    if (n.R?.value === source) {
      n.R = node;
    }
  });
  map[source] = node;

  if (source[2] === "A") {
    sources.push(source);
  }
});

let current = "AAA";
let i = 0;
while (current !== "ZZZ") {
  const dir = instructions[i % instructions.length] as "L" | "R";
  current = map[current][dir]?.value ?? "";
  i++;
}

part1 += i;

const steps = sources.map((s) => {
  let current = s;

  i = 0;
  while (current[2] !== "Z") {
    const dir = instructions[i % instructions.length] as "L" | "R";
    current = map[current][dir]?.value ?? "";
    i++;
  }

  return i;
});

// https://www.30secondsofcode.org/js/s/lcm/
const lcm = (...arr: number[]) => {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const _lcm = (x: number, y: number): number => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

part2 += lcm(...steps);

console.log(part1, part2);

console.timeEnd("");
