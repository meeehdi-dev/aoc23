package main

import (
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
	"time"
)

func getValue(time int, distance int) int {
	maxSpeed := math.Floor(float64(time) / 2)
	speed := (float64(time) - math.Sqrt(math.Pow(float64(time), 2)-4*float64(distance))) / 2
	normalSpeed := math.Floor(speed)
	return int((maxSpeed-normalSpeed)*2 - float64((time - 1) % 2))
}

func main() {
	start := time.Now()

	file, _ := os.ReadFile("d06/input.txt")
	input := string(file)
	lines := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	times := make([]int, 0)
	distances := make([]int, 0)
	totalTime := 0
	totalDistance := 0

	for _, line := range lines {
		if line == "" {
			continue
		}

		if strings.Index(line, "Time: ") == 0 {
			timesStr := strings.Split(strings.Split(line, ": ")[1], " ")
			totalTimeStr := ""
			for _, t := range timesStr {
				if t != "" {
					totalTimeStr += t
					time, _ := strconv.Atoi(t)
					times = append(times, time)
				}
			}
			totalTime, _ = strconv.Atoi(totalTimeStr)
		}

		if strings.Index(line, "Distance: ") == 0 {
			distancesStr := strings.Split(strings.Split(line, ": ")[1], " ")
			totalDistanceStr := ""
			for _, t := range distancesStr {
				if t != "" {
					totalDistanceStr += t
					distance, _ := strconv.Atoi(t)
					distances = append(distances, distance)
				}
			}
			totalDistance, _ = strconv.Atoi(totalDistanceStr)
		}
	}

  part1 = 1
  for i := 0; i < len(times); i++ {
    time := times[i]
    distance := distances[i]
    value := getValue(time, distance)
    if (value > 0) {
      part1 *= value
    }
  }

  part2 = getValue(totalTime, totalDistance)

	fmt.Println(part1, part2)

	elapsed := time.Since(start)
	fmt.Printf("[%.2fms]\n", float64(elapsed)/1000000)
}
