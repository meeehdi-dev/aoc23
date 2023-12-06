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

const getValue = (time: number, distance: number) => {
  const maxSpeed = Math.floor(time / 2);
  const speed = (time - Math.sqrt(Math.pow(time, 2) - 4 * distance)) / 2;
  const normalSpeed = Math.floor(speed);
  return (maxSpeed - normalSpeed) * 2 - ((time - 1) % 2);
};

for (let i = 0; i < times.length; i++) {
  const [time, distance] = [times[i], distances[i]];
  const value = getValue(time, distance);
  if (value > 0) {
    part1 *= value;
  }
}

part2 += getValue(totalTime, totalDistance);

console.log(part1, part2);

console.timeEnd("");
