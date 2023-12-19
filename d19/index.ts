import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d19/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

type Part = "x" | "m" | "a" | "s";
type Target = Lowercase<string>;
type Result = "A" | "R";
type Next = Target | Result;
interface Rule {
  part: Part;
  op: ">" | "<";
  value: number;
  next: Next;
}
const rules: Record<string, { rules: Rule[]; next: Next }> = {};
const xs: number[] = [1];
const ms: number[] = [1];
const as: number[] = [1];
const ss: number[] = [1];

const parts: Part[] = ["x", "m", "a", "s"];

const getResult = (xmas: {
  x: number;
  m: number;
  a: number;
  s: number;
}): Next => {
  let currentRule: Next = "in";
  while (currentRule !== "A" && currentRule !== "R") {
    const { rules: currentRules, next: currentNext } = rules[currentRule];
    let next: Next = currentNext as Next;
    for (let i = 0; i < currentRules.length; i++) {
      const r = currentRules[i];
      for (let j = 0; j < parts.length; j++) {
        const part = parts[j];
        if (part === r.part) {
          if (
            (r.op === ">" && xmas[part] > r.value) ||
            (r.op === "<" && xmas[part] < r.value)
          ) {
            next = r.next;
            i = currentRules.length;
            j = parts.length;
          }
        }
      }
    }
    currentRule = next;
  }

  return currentRule;
};

lines.forEach((line) => {
  if (!line) {
    return;
  }

  if (line[0] === "{") {
    const workflow = line.slice(1, -1).split(",");
    let x = 0;
    let m = 0;
    let a = 0;
    let s = 0;
    workflow.forEach((w) => {
      const [name, value] = w.split("=");
      if (name === "x") {
        x = Number(value);
      } else if (name === "m") {
        m = Number(value);
      } else if (name === "a") {
        a = Number(value);
      } else if (name === "s") {
        s = Number(value);
      }
    });
    const result = getResult({ x, m, a, s });
    if (result === "A") {
      part1 += x + m + a + s;
    }
  } else {
    const [name, rulesStr] = line.slice(0, -1).split("{");
    rules[name] = { rules: [], next: "A" };
    rulesStr.split(",").forEach((r) => {
      const parts = r.split(":");
      if (parts.length === 1) {
        rules[name].next = parts[0] as Next;
      } else {
        const sup = parts[0].includes(">");
        const ruleParts = sup ? parts[0].split(">") : parts[0].split("<");
        if (ruleParts[0] === "x") {
          xs.push(Number(ruleParts[1]) - 1);
          xs.push(Number(ruleParts[1]));
        } else if (ruleParts[0] === "m") {
          ms.push(Number(ruleParts[1]) - 1);
          ms.push(Number(ruleParts[1]));
        } else if (ruleParts[0] === "a") {
          as.push(Number(ruleParts[1]) - 1);
          as.push(Number(ruleParts[1]));
        } else if (ruleParts[0] === "s") {
          ss.push(Number(ruleParts[1]) - 1);
          ss.push(Number(ruleParts[1]));
        }
        rules[name].rules.push({
          part: ruleParts[0] as Part,
          op: sup ? ">" : "<",
          value: Number(ruleParts[1]),
          next: parts[1] as Next,
        });
      }
    });
  }
});

xs.push(4000);
ms.push(4000);
as.push(4000);
ss.push(4000);

xs.sort((a, b) => a - b);
ms.sort((a, b) => a - b);
as.sort((a, b) => a - b);
ss.sort((a, b) => a - b);

// const previous = [1, 1, 1, 1];
// for (let ix = 0; ix < xs.length; ix++) {
//   const x = xs[ix];
//   previous[1] = 1;
//   previous[2] = 1;
//   previous[3] = 1;
//   for (let im = 0; im < ms.length; im++) {
//     const m = ms[im];
//     previous[2] = 1;
//     previous[3] = 1;
//     for (let ia = 0; ia < as.length; ia++) {
//       const a = as[ia];
//       previous[3] = 1;
//       for (let is = 0; is < ss.length; is++) {
//         const s = ss[is];
//         const result = getResult({ x, m, a, s });
//         if (result === "A") {
//           const diffX = Math.abs(x - previous[0]);
//           const diffM = Math.abs(m - previous[1]);
//           const diffA = Math.abs(a - previous[2]);
//           const diffS = Math.abs(s - previous[3]);
//           const diff =
//             (diffX || 1) * (diffM || 1) * (diffA || 1) * (diffS || 1);
//           part2 += diff;
//         }
//         previous[3] = s;
//       }
//       previous[2] = a;
//     }
//     previous[1] = m;
//   }
//   previous[0] = x;
// }

part1 += 0;
part2 += 0;

console.log(part1, part2);

console.timeEnd("");
