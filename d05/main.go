package main

import (
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
	"time"
)

const (
	SeedToSoil            string = "seed-to-soil"
	SoilToFertilizer             = "soil-to-fertilizer"
	FertilizerToWater            = "fertilizer-to-water"
	WaterToLight                 = "water-to-light"
	LightToTemperature           = "light-to-temperature"
	TemperatureToHumidity        = "temperature-to-humidity"
	HumidityToLocation           = "humidity-to-location"
)

type MapData struct {
	destination int
	source      int
	mapRange    int
}
type SeedData struct {
	source    int
	seedRange int
}

func convert1(maps map[string][]MapData, value int, mapType string) int {
	for _, m := range maps[mapType] {
		if m.source <= value && (m.source+m.mapRange > value) {
			return m.destination + (value - m.source)
		}
	}
	return value
}

func convert2(maps map[string][]MapData, value int, mapType string) (int, int, int) {
	for _, m := range maps[mapType] {
		if m.source <= value && (m.source+m.mapRange > value) {
			return m.destination + (value - m.source), m.source, m.mapRange
		}
	}

	next := MapData{source: -1, mapRange: -1}
	for _, m := range maps[mapType] {
		if m.source > value {
			if next.source > m.source {
				next = m
			}
		}
	}

	return value, next.source, next.mapRange
}

func main() {
	start := time.Now()

	file, _ := os.ReadFile("d05/input.txt")
	input := string(file)
	lines := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	seeds1 := make([]SeedData, 0)
	seeds2 := make([]SeedData, 0)
	maps := make(map[string][]MapData)
	maps[SeedToSoil] = make([]MapData, 0)
	maps[SoilToFertilizer] = make([]MapData, 0)
	maps[FertilizerToWater] = make([]MapData, 0)
	maps[WaterToLight] = make([]MapData, 0)
	maps[LightToTemperature] = make([]MapData, 0)
	maps[TemperatureToHumidity] = make([]MapData, 0)
	maps[HumidityToLocation] = make([]MapData, 0)

	currentType := ""

	for _, line := range lines {
		if line == "" {
			currentType = ""
			continue
		}

		if currentType != "" {
			data := strings.Split(line, " ")
			destination, _ := strconv.Atoi(data[0])
			source, _ := strconv.Atoi(data[1])
			mapRange, _ := strconv.Atoi(data[2])
			maps[currentType] = append(maps[currentType], MapData{source: source, destination: destination, mapRange: mapRange})
		}

		isSeeds := strings.HasPrefix(line, "seeds: ")
		if isSeeds {
			data := strings.Split(line, ": ")
			seeds := data[1]
			seedsArr := strings.Split(seeds, " ")
			i := 0
			for i < len(seedsArr) {
				seed := seedsArr[i]
				s, _ := strconv.Atoi(seed)
				seeds1 = append(seeds1, SeedData{source: s, seedRange: 1})
				i++
			}
			i = 0
			for i < len(seedsArr) {
				seed := seedsArr[i]
				s, _ := strconv.Atoi(seed)
				rx := seedsArr[i+1]
				r, _ := strconv.Atoi(rx)
				seeds2 = append(seeds2, SeedData{source: s, seedRange: r})
				i += 2
			}
		}

		isMap := strings.HasSuffix(line, " map:")
		if isMap {
			data := strings.Split(line, " ")
			currentType = data[0]
		}
	}

	location1 := math.MaxInt
	for _, seed := range seeds1 {
		soil := convert1(maps, seed.source, SeedToSoil)
		fertilizer := convert1(maps, soil, SoilToFertilizer)
		water := convert1(maps, fertilizer, FertilizerToWater)
		light := convert1(maps, water, WaterToLight)
		temperature := convert1(maps, light, LightToTemperature)
		humidity := convert1(maps, temperature, TemperatureToHumidity)
		location := convert1(maps, humidity, HumidityToLocation)
		if location < location1 {
			location1 = location
		}
	}

	location2 := math.MaxInt
	for _, seed := range seeds2 {
		minLocation := math.MaxInt
		for i := 0; i < seed.seedRange; i++ {
			soil, soilStart, soilRange := convert2(maps, seed.source+i, SeedToSoil)
			fertilizer, fertilizerStart, fertilizerRange := convert2(maps, soil, SoilToFertilizer)
			water, waterStart, waterRange := convert2(maps, fertilizer, FertilizerToWater)
			light, lightStart, lightRange := convert2(maps, water, WaterToLight)
			temperature, temperatureStart, temperatureRange := convert2(maps, light, LightToTemperature)
			humidity, humidityStart, humidityRange := convert2(maps, temperature, TemperatureToHumidity)
			location, locationStart, locationRange := convert2(maps, humidity, HumidityToLocation)
			skips := make([]int, 0)
			if soilStart >= 0 {
				skips = append(skips, soilStart+soilRange-seed.source-i-1)
			}
			if fertilizerStart >= 0 {
				skips = append(skips, fertilizerStart+fertilizerRange-soil-1)
			}
			if waterStart >= 0 {
				skips = append(skips, waterStart+waterRange-fertilizer-1)
			}
			if lightStart >= 0 {
				skips = append(skips, lightStart+lightRange-water-1)
			}
			if temperatureStart >= 0 {
				skips = append(skips, temperatureStart+temperatureRange-light-1)
			}
			if humidityStart >= 0 {
				skips = append(skips, humidityStart+humidityRange-temperature-1)
			}
			if locationStart >= 0 {
				skips = append(skips, locationStart+locationRange-humidity-1)
			}
			minSkip := math.MaxInt
			for _, skip := range skips {
				if skip < minSkip {
					minSkip = skip
				}
			}
			i += minSkip
			if location < minLocation {
				minLocation = location
			}
		}
		if minLocation < location2 {
			location2 = minLocation
		}
	}

	part1 += location1
	part2 += location2

	fmt.Println(part1, part2)

	elapsed := time.Since(start)
	fmt.Printf("[%.2fms]\n", float64(elapsed)/1000000)
}
