import { readFileSync } from "fs-extra";

const input = readFileSync("d02/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;
const games: Record<string, { blue: number; red: number; green: number }[]> =
  {};
lines.forEach((line) => {
  if (!line) {
    return;
  }
  const [gameStr, gamesStr] = line.split(": ");
  const [, id] = gameStr.split(" ");
  games[id] = [];

  gamesStr.split("; ").forEach((score) => {
    const current = { blue: 0, red: 0, green: 0 };
    score.split(", ").forEach((s) => {
      const [value, color] = s.split(" ");
      current[color as "blue" | "red" | "green"] += Number(value);
    });
    games[id].push(current);
  });
});

part1 += Object.entries(games)
  .filter(([, game]) =>
    game.every(
      (score) => score.blue <= 14 && score.green <= 13 && score.red <= 12,
    ),
  )
  .reduce((acc, [key]) => acc + Number(key), 0);

const minCubeGames = Object.entries(games).reduce<
  Record<string, { blue: number; red: number; green: number; pow: number }>
>((acc, [key, game]) => {
  const blue = game.reduce((acc, score) => Math.max(acc, score.blue), 0);
  const red = game.reduce((acc, score) => Math.max(acc, score.red), 0);
  const green = game.reduce((acc, score) => Math.max(acc, score.green), 0);

  acc[key] = { blue: 0, red: 0, green: 0, pow: 0 };

  const maxBlue = Math.max(acc[key].blue, blue);
  const maxRed = Math.max(acc[key].red, red);
  const maxGreen = Math.max(acc[key].green, green);

  acc[key] = {
    blue: maxBlue,
    red: maxRed,
    green: maxGreen,
    pow: maxBlue * maxRed * maxGreen,
  };
  return acc;
}, {});
part2 += Object.values(minCubeGames).reduce((acc, game) => acc + game.pow, 0);

console.log(part1, part2);
