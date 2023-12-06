import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d05/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

enum MapType {
  SeedToSoil = "seed-to-soil",
  SoilToFertilizer = "soil-to-fertilizer",
  FertilizerToWater = "fertilizer-to-water",
  WaterToLight = "water-to-light",
  LightToTemperature = "light-to-temperature",
  TemperatureToHumidity = "temperature-to-humidity",
  HumidityToLocation = "humidity-to-location",
}
interface MapData {
  destination: number;
  source: number;
  range: number;
}
interface SeedData {
  source: number;
  range: number;
}

const seeds1: SeedData[] = [];
const seeds2: SeedData[] = [];
const maps: Record<MapType, MapData[]> = {
  [MapType.SeedToSoil]: [],
  [MapType.SoilToFertilizer]: [],
  [MapType.FertilizerToWater]: [],
  [MapType.WaterToLight]: [],
  [MapType.LightToTemperature]: [],
  [MapType.TemperatureToHumidity]: [],
  [MapType.HumidityToLocation]: [],
};
let currentType: MapType | undefined;
lines.forEach((line) => {
  if (!line) {
    currentType = undefined;
    return;
  }

  if (currentType) {
    const [destinationStr, sourceStr, rangeStr] = line.split(" ");
    const destination = Number(destinationStr);
    const source = Number(sourceStr);
    const range = Number(rangeStr);
    maps[currentType].push({ destination, source, range });
  }

  if (line.startsWith("seeds: ")) {
    const [, seedsStr] = line.split(": ");
    const seedsArr = seedsStr.split(" ");
    for (let i = 0; i < seedsArr.length; i++) {
      const s = seedsArr[i];
      seeds1.push({ source: Number(s), range: 1 });
    }
    for (let i = 0; i < seedsArr.length; i += 2) {
      const s = seedsArr[i];
      const r = seedsArr[i + 1];
      seeds2.push({ source: Number(s), range: Number(r) });
    }
  }

  if (line.endsWith(" map:")) {
    const [type] = line.split(" ");
    currentType = type as MapType;
  }
});

const convert1 = (value: number, type: MapType): number => {
  const map = maps[type].find(
    (m) => m.source <= value && m.source + m.range > value,
  );
  if (!map) {
    return value;
  }
  return map.destination + (value - map.source);
};

const convert2 = (value: number, type: MapType): [number, number, number] => {
  const map = maps[type].find(
    (m) => m.source <= value && m.source + m.range > value,
  );
  if (!map) {
    const nextMaps = maps[type].filter((m) => m.source > value);
    if (nextMaps.length === 0) {
      return [value, -1, -1];
    }
    nextMaps.sort((a, b) => a.source - b.source);
    const nextMap = nextMaps[0];
    return [value, nextMap.source, nextMap.range];
  }
  return [map.destination + (value - map.source), map.source, map.range];
};

const locations1 = seeds1.map((seed) => {
  const soil = convert1(seed.source, MapType.SeedToSoil);
  const fertilizer = convert1(soil, MapType.SoilToFertilizer);
  const water = convert1(fertilizer, MapType.FertilizerToWater);
  const light = convert1(water, MapType.WaterToLight);
  const temperature = convert1(light, MapType.LightToTemperature);
  const humidity = convert1(temperature, MapType.TemperatureToHumidity);
  const location = convert1(humidity, MapType.HumidityToLocation);
  return location;
});

part1 += Math.min(...locations1);

const locations2 = seeds2.map((seed) => {
  let minLocation = Infinity;
  for (let i = 0; i < seed.range; i++) {
    const [soil, soilStart, soilRange] = convert2(
      seed.source + i,
      MapType.SeedToSoil,
    );
    const [fertilizer, fertilizerStart, fertilizerRange] = convert2(
      soil,
      MapType.SoilToFertilizer,
    );
    const [water, waterStart, waterRange] = convert2(
      fertilizer,
      MapType.FertilizerToWater,
    );
    const [light, lightStart, lightRange] = convert2(
      water,
      MapType.WaterToLight,
    );
    const [temperature, temperatureStart, temperatureRange] = convert2(
      light,
      MapType.LightToTemperature,
    );
    const [humidity, humidityStart, humidityRange] = convert2(
      temperature,
      MapType.TemperatureToHumidity,
    );
    const [location, locationStart, locationRange] = convert2(
      humidity,
      MapType.HumidityToLocation,
    );
    const skips: number[] = [];
    if (soilStart >= 0) {
      skips.push(soilStart + soilRange - seed.source - i - 1);
    }
    if (fertilizerStart >= 0) {
      skips.push(fertilizerStart + fertilizerRange - soil - 1);
    }
    if (waterStart >= 0) {
      skips.push(waterStart + waterRange - fertilizer - 1);
    }
    if (lightStart >= 0) {
      skips.push(lightStart + lightRange - water - 1);
    }
    if (temperatureStart >= 0) {
      skips.push(temperatureStart + temperatureRange - light - 1);
    }
    if (humidityStart >= 0) {
      skips.push(humidityStart + humidityRange - temperature - 1);
    }
    if (locationStart >= 0) {
      skips.push(locationStart + locationRange - humidity - 1);
    }
    i += Math.min(...skips);
    if (location < minLocation) {
      minLocation = location;
    }
  }
  return minLocation;
});

part2 += Math.min(...locations2);

console.log(part1, part2);

console.timeEnd("");
