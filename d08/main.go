package main

import (
	"fmt"
	"os"
	"strings"
	"time"
)

type node struct {
	value string
	steps int
	L     *node
	R     *node
}

// golang implementation of least common multiple using []int as input
// provided by copilot
func gcd(a, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}
func _lcm(nums ...int) int {
	var result int = nums[0]
	for i := 1; i < len(nums); i++ {
		result = (result * nums[i]) / gcd(result, nums[i])
	}
	return result
}
func lcm(nums []int) int {
	var result int = nums[0]
	for i := 1; i < len(nums); i++ {
		result = _lcm(result, nums[i])
	}
	return result
}

func main() {
	start := time.Now()

	file, _ := os.ReadFile("d08/input.txt")
	input := string(file)
	lines := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	instructions := ""
	nodeMap := make(map[string]node)
	sources := make([]string, 0)

	for _, line := range lines {
		if line == "" {
			continue
		}

		if instructions == "" {
			instructions = line
			continue
		}

		lineData := strings.Split(line, " = ")
		source := lineData[0]
		destination := lineData[1]

		destinationData := strings.Split(destination[1:len(destination)-1], ", ")
		left := destinationData[0]
		right := destinationData[1]

		var leftNode *node
		var rightNode *node
		if left != source {
			n, ok := nodeMap[left]
			if ok {
				leftNode = &n
			} else {
				leftNode = &node{value: left, steps: 0}
			}
		}
		if right != source {
			n, ok := nodeMap[right]
			if ok {
				rightNode = &n
			} else {
				rightNode = &node{value: right, steps: 0}
			}
		}

		current := node{value: source, steps: 0, L: leftNode, R: rightNode}

		for _, n := range nodeMap {
			if n.L.value == source {
				n.L = &current
			}
			if n.R.value == source {
				n.R = &current
			}
		}

		nodeMap[source] = current

		if source[2:3] == "A" {
			sources = append(sources, source)
		}
	}

	current := "AAA"
	i := 0
	for current != "ZZZ" {
		index := i % len(instructions)
		dir := instructions[index : index+1]
		if dir == "L" {
			current = nodeMap[current].L.value
		} else {
			current = nodeMap[current].R.value
		}
		i++
	}
	part1 += i

	stepsArr := make([]int, 0)
	for _, source := range sources {
		current := source
		i := 0
		for current[2:3] != "Z" {
			index := i % len(instructions)

			dir := instructions[index : index+1]
			if dir == "L" {
				current = nodeMap[current].L.value
			} else if dir == "R" {
				current = nodeMap[current].R.value
			}
			i++
		}

		stepsArr = append(stepsArr, i)
	}

	part2 += lcm(stepsArr)

	fmt.Println(part1, part2)

	elapsed := time.Since(start)
	fmt.Printf("[%.2fms]\n", float64(elapsed)/1000000)
}
