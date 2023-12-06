import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d06/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 1;
let part2 = 0;

let times: number[] = [];
let distances: number[] = [];
let totalTime = 0;
let totalDistance = 0;
lines.forEach((line) => {
  if (!line) {
    return;
  }

  if (line.startsWith("Time: ")) {
    times = line
      .split(": ")[1]
      .split(" ")
      .filter((s) => s !== "")
      .map(Number);
    totalTime = Number(times.map((t) => t.toString()).join(""));
  }

  if (line.startsWith("Distance: ")) {
    distances = line
      .split(": ")[1]
      .split(" ")
      .filter((s) => s !== "")
      .map(Number);
    totalDistance = Number(distances.map((t) => t.toString()).join(""));
  }
});

for (let i = 0; i < times.length; i++) {
  const [time, distance] = [times[i], distances[i]];
  let maxSpeed0 = Math.floor(time / 2);
  let maxSpeed1 = time - Math.floor(time / 2 - 0.5);
  let maxDistance0 = Math.floor(maxSpeed0 * (time - maxSpeed0));
  let maxDistance1 = Math.floor(maxSpeed1 * (time - maxSpeed1));
  const speed = (time - Math.sqrt(Math.pow(time, 2) - 4 * distance)) / 2;
  const normalSpeed0 = Math.floor(speed);
  const normalSpeed1 = time - normalSpeed0;
  let j = 0;
  if (maxDistance0 > distance) {
    const diff = maxSpeed0 - normalSpeed0;
    j += diff;
    maxSpeed0 -= diff;
    maxDistance0 = Math.floor(maxSpeed0 * (time - maxSpeed0));
  }
  if (maxDistance1 > distance) {
    const diff = normalSpeed1 - maxSpeed1;
    j += diff;
    maxSpeed1 += diff;
    maxDistance1 = Math.floor(maxSpeed1 * (time - maxSpeed1));
  }
  if (j > 0) {
    part1 *= j;
  }
}

let maxSpeed0 = Math.floor(totalTime / 2);
let maxSpeed1 = totalTime - Math.floor(totalTime / 2 - 0.5);
let maxDistance0 = Math.floor(maxSpeed0 * (totalTime - maxSpeed0));
let maxDistance1 = Math.floor(maxSpeed1 * (totalTime - maxSpeed1));
const speed =
  (totalTime - Math.sqrt(Math.pow(totalTime, 2) - 4 * totalDistance)) / 2;
const normalSpeed0 = Math.floor(speed);
const normalSpeed1 = totalTime - normalSpeed0;
let j = 0;
if (maxDistance0 > totalDistance) {
  const diff = maxSpeed0 - normalSpeed0;
  j += diff;
  maxSpeed0 -= diff;
  maxDistance0 = Math.floor(maxSpeed0 * (totalTime - maxSpeed0));
}
if (maxDistance1 > totalDistance) {
  const diff = normalSpeed1 - maxSpeed1;
  j += diff;
  maxSpeed1 += diff;
  maxDistance1 = Math.floor(maxSpeed1 * (totalTime - maxSpeed1));
}
part2 += j;

console.log(part1, part2);

console.timeEnd("");
