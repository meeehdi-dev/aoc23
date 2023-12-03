package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type game struct {
	blue  int
	red   int
	green int
}

func main() {
	file, _ := os.ReadFile("d02/input.txt")
	input := string(file)
	lines := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	games := make(map[string][]game)

	for _, line := range lines {
		if line == "" {
			continue
		}
		lineData := strings.Split(line, ": ")
		gameStr := lineData[0]
		gamesStr := lineData[1]
		gameData := strings.Split(gameStr, " ")
		gameId := gameData[1]
		games[gameId] = make([]game, 0)

		scoresStr := strings.Split(gamesStr, "; ")
		for _, scoreStr := range scoresStr {
			currentGame := game{blue: 0, red: 0, green: 0}
			scoreData := strings.Split(scoreStr, ", ")
			for _, score := range scoreData {
				singleScore := strings.Split(score, " ")
				value := singleScore[0]
				color := singleScore[1]
				conv, _ := strconv.Atoi(value)
				if color == "blue" {
					currentGame.blue += conv
				} else if color == "red" {
					currentGame.red += conv
				} else if color == "green" {
					currentGame.green += conv
				}
			}
			games[gameId] = append(games[gameId], currentGame)
		}
	}

	for gameId, gameData := range games {
		ok := true
		for _, game := range gameData {
			if !(game.blue <= 14 && game.green <= 13 && game.red <= 12) {
				ok = false
			}
		}
		if ok == true {
			conv, _ := strconv.Atoi(gameId)
			part1 += conv
		}
	}

	for _, gameData := range games {
		currentGame := game{blue: 0, red: 0, green: 0}
		for _, game := range gameData {
			currentGame.blue = max(currentGame.blue, game.blue)
			currentGame.red = max(currentGame.red, game.red)
			currentGame.green = max(currentGame.green, game.green)
		}
		part2 += currentGame.blue * currentGame.red * currentGame.green
	}

	fmt.Println(part1, part2)
}
