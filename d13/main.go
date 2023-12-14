package main

import (
	"fmt"
	"os"
	"strings"
	"time"
)

type number struct {
	value     int
	adjacents []string
}
type symbol struct {
	value string
}

func main() {
	start := time.Now()

	file, _ := os.ReadFile("d13/input.txt")
	input := string(file)
	lines := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	for _, line := range lines {
		if line == "" {
			continue
		}
	}

	fmt.Println(part1, part2)

	elapsed := time.Since(start)
	fmt.Printf("[%.2fms]\n", float64(elapsed)/1000000)
}
