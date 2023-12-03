package main

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

type number struct {
	value     int
	adjacents []string
}
type symbol struct {
	value string
}

func main() {
	file, _ := os.ReadFile("d03/example.txt")
	input := string(file)
	lines := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	numberRegex, _ := regexp.Compile(`\d+`)
	symbolRegex, _ := regexp.Compile(`[^\d.]`)
	numbersMap := make(map[string]number)
	symbolsMap := make(map[string]symbol)

	for index, line := range lines {
		if line == "" {
			continue
		}

		numbers := numberRegex.FindAllStringSubmatchIndex(line, -1)
		symbols := symbolRegex.FindAllStringSubmatchIndex(line, -1)

		for _, num := range numbers {
			match := line[num[0]:num[1]]
			key := strconv.Itoa(index) + "_" + strconv.Itoa(num[0])

			matchLen := len(match)
			conv, _ := strconv.Atoi(match)
			adjacents := make([]string, 0)
			for i := -1; i <= matchLen; i++ {
				adjacents = append(adjacents, strconv.Itoa(index-1)+"_"+strconv.Itoa(num[0]+i))
				adjacents = append(adjacents, strconv.Itoa(index)+"_"+strconv.Itoa(num[0]+i))
				adjacents = append(adjacents, strconv.Itoa(index+1)+"_"+strconv.Itoa(num[0]+i))
			}

			for i := 0; i < len(adjacents); i++ {
				if strings.Contains(adjacents[i], "-") {
					adjacents = append(adjacents[:i], adjacents[i+1:]...)
					i--
				}
			}

			numbersMap[key] = number{value: conv, adjacents: adjacents}
		}
		for _, sym := range symbols {
			match := line[sym[0]:sym[1]]
			key := strconv.Itoa(index) + "_" + strconv.Itoa(sym[0])

			symbolsMap[key] = symbol{value: match}
		}
	}

	for _, num := range numbersMap {
		found := false
		for key := range symbolsMap {
			if found {
				break
			}
			for _, adj := range num.adjacents {
				if found {
					break
				}
				if adj == key {
					found = true
				}
			}
		}
		if found {
			part1 += num.value
		}
	}

	for key, value := range symbolsMap {
		nums := make([]int, 0)
		stars := 0
		for _, num := range numbersMap {
			for _, adj := range num.adjacents {
				if adj == key {
					nums = append(nums, num.value)
					if value.value == "*" {
						stars++
					}
				}
			}
		}
		if len(nums) == 2 && stars == 2 {
			part2 += nums[0] * nums[1]
		}
	}

	fmt.Println(part1, part2)
}
