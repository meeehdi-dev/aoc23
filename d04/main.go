package main

import (
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
	"time"
)

type winning struct {
	count  int
	values []string
}

func main() {
	start := time.Now()

	file, _ := os.ReadFile("d04/input.txt")
	input := string(file)
	lines := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	winningsMap := make(map[string]winning)

  cardIndex := 1
	for _, line := range lines {
		if line == "" {
			continue
		}

		cardData := strings.Split(line, ": ")
		cardIdStr := cardData[0]
		cardStr := cardData[1]
		cardIdData := strings.Split(cardIdStr, " ")
		filteredCardIdData := make([]string, 0)
		for _, data := range cardIdData {
			if data != "" {
				filteredCardIdData = append(filteredCardIdData, data)
			}
		}
		winningsData := strings.Split(cardStr, " | ")
		winningsStr := strings.Split(winningsData[0], " ")
		numbersStr := strings.Split(winningsData[1], " ")
		filteredWinningStr := make([]string, 0)
		for _, data := range winningsStr {
			if data != "" {
				filteredWinningStr = append(filteredWinningStr, data)
			}
		}
		filteredNumbersStr := make([]string, 0)
		for _, data := range numbersStr {
			if data != "" {
				filteredNumbersStr = append(filteredNumbersStr, data)
			}
		}
		values := make([]string, 0)
		for _, n := range filteredNumbersStr {
			for _, w := range filteredWinningStr {
				if n == w {
					values = append(values, n)
				}
			}
		}

    cardKey := strconv.Itoa(cardIndex)
    winningsMap[cardKey] = winning{
      count: 1,
      values: values,
    }

    cardIndex++
	}

  for _, winning := range winningsMap {
    if len(winning.values) == 0 {
      part1 += 0
    } else {
      part1 += int(math.Pow(2, float64(len(winning.values) - 1)))
    }
  }

  for cardId := 0; cardId <= cardIndex; cardId++ {
    cardKey := strconv.Itoa(cardId)
    winning := winningsMap[cardKey]
    for i := 1; i <= len(winning.values); i++ {
      nextId := cardId + i
      nextKey := strconv.Itoa(nextId)
      next := winningsMap[nextKey]
      next.count += winning.count
      winningsMap[nextKey] = next
    }
  }

  for _, winning := range winningsMap {
    part2 += 1 + len(winning.values) * winning.count
  }

	fmt.Println(part1, part2)

	elapsed := time.Since(start)
	fmt.Printf("[%.2fms]\n", float64(elapsed)/1000000)
}
