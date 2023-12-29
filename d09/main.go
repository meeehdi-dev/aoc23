package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

func main() {
	start := time.Now()

	file, _ := os.ReadFile("d09/input.txt")
	input := string(file)
	lines := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	for _, line := range lines {
		if line == "" {
			continue
		}

		steps := strings.Split(line, " ")
		diffs := make(map[int][]int)
		maxLevel := 0
		for i := 0; i < len(steps)-1; i++ {
			step, _ := strconv.Atoi(steps[i])
			nextStep, _ := strconv.Atoi(steps[i+1])

			diff := nextStep - step
			level := 0

			for {
				if level > maxLevel {
					maxLevel = level
				}

        if diffs[level] == nil {
          diffs[level] = []int{}
          diffs[level] = append(diffs[level], diff)
          break
        }

				lastDiff := diffs[level][len(diffs[level])-1]
        diffs[level] = append(diffs[level], diff)

				if lastDiff == 0 && diff == 0 {
					break
				} else {
					diff = diff - lastDiff
					level++
				}
			}
		}

		diff1 := 0
		diff2 := 0
		for i := maxLevel; i >= 0; i-- {
			levelDiffs := diffs[i]
			if levelDiffs == nil {
				continue
			}
			diff1 += levelDiffs[len(levelDiffs)-1]
			diff2 = levelDiffs[0] - diff2
		}

		lastStep, _ := strconv.Atoi(steps[len(steps)-1])
		firstStep, _ := strconv.Atoi(steps[0])
		part1 += lastStep + diff1
		part2 += firstStep - diff2
	}

	fmt.Println(part1, part2)

	elapsed := time.Since(start)
	fmt.Printf("[%.2fms]\n", float64(elapsed)/1000000)
}
