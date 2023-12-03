package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
	"time"
)

func Reverse(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}

func main() {
	start := time.Now()

	digitsMap := map[string]int{
		"1": 1,
		"2": 2,
		"3": 3,
		"4": 4,
		"5": 5,
		"6": 6,
		"7": 7,
		"8": 8,
		"9": 9,
	}
	strDigitsMap := map[string]int{
		"one":   1,
		"two":   2,
		"three": 3,
		"four":  4,
		"five":  5,
		"six":   6,
		"seven": 7,
		"eight": 8,
		"nine":  9,
	}
	reverseStrDigitsMap := map[string]int{}
	for k, v := range strDigitsMap {
		reverseStrDigitsMap[Reverse(k)] = v
	}
	fullDigitsMap := map[string]int{}
	for k, v := range digitsMap {
		fullDigitsMap[k] = v
	}
	for k, v := range strDigitsMap {
		fullDigitsMap[k] = v
	}
	reverseFullDigitsMap := map[string]int{}
	for k, v := range digitsMap {
		reverseFullDigitsMap[k] = v
	}
	for k, v := range reverseStrDigitsMap {
		reverseFullDigitsMap[k] = v
	}
	digitsKeys := make([]string, len(digitsMap))
	i := 0
	for k := range digitsMap {
		digitsKeys[i] = k
		i++
	}
	fullDigitsKeys := make([]string, len(fullDigitsMap))
	i = 0
	for k := range fullDigitsMap {
		fullDigitsKeys[i] = k
		i++
	}
	reverseFullDigitsKeys := make([]string, len(reverseFullDigitsMap))
	i = 0
	for k := range reverseFullDigitsMap {
		reverseFullDigitsKeys[i] = k
		i++
	}

	digitsStr := strings.Join(digitsKeys, "|")
	digitsRe, _ := regexp.Compile("(" + digitsStr + ")")
	fullDigitsStr := strings.Join(fullDigitsKeys, "|")
	fullDigitsRe, _ := regexp.Compile("(" + fullDigitsStr + ")")
	reverseFullDigitsStr := strings.Join(reverseFullDigitsKeys, "|")
	reverseFullDigitsRe, _ := regexp.Compile("(" + reverseFullDigitsStr + ")")

	file, _ := os.ReadFile("d01/input.txt")
	input := string(file)
	lines := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	for _, line := range lines {
		if len(line) == 0 {
			continue
		}

		rLine := Reverse(line)

		firstMatch1 := -1
		lastMatch1 := -1
		firstMatch2 := -1
		lastMatch2 := -1

		digitsMatch := digitsRe.FindString(line)
		if len(digitsMatch) > 0 {
			firstMatch1 = digitsMap[digitsMatch]
			lastMatch1 = firstMatch1
		}
		reverseDigitsMatch := digitsRe.FindString(rLine)
		if len(reverseDigitsMatch) > 0 {
			lastMatch1 = digitsMap[reverseDigitsMatch]
		}

		fullDigitsMatch := fullDigitsRe.FindString(line)
		if len(fullDigitsMatch) > 0 {
			firstMatch2 = fullDigitsMap[fullDigitsMatch]
			lastMatch2 = firstMatch2
		}
		reverseFullDigitsMatch := reverseFullDigitsRe.FindString(rLine)
		if len(reverseFullDigitsMatch) > 0 {
			lastMatch2 = reverseFullDigitsMap[reverseFullDigitsMatch]
		}

		if firstMatch1 >= 0 && lastMatch1 >= 0 {
			fullMatch1 := firstMatch1*10 + lastMatch1
			part1 += fullMatch1
		}

		if firstMatch2 >= 0 && lastMatch2 >= 0 {
			fullMatch2 := firstMatch2*10 + lastMatch2
			part2 += fullMatch2
		}
	}

	fmt.Println(part1, part2)

	elapsed := time.Since(start)
	fmt.Printf("[%.2fms]\n", float64(elapsed)/1000000)
}
