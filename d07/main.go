package main

import (
	"fmt"
	"math"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"
)

const (
	FiveOfAKind  string = "fiveOfAKind"
	FourOfAKind         = "fourOfAKind"
	FullHouse           = "fullHouse"
	ThreeOfAKind        = "threeOfAKind"
	TwoPair             = "twoPair"
	OnePair             = "onePair"
	HighCard            = "highCard"
)

type Hand struct {
	cardCount map[string]int
	hand      []string
	bid       int
	handType  string
}

func getHandType(cardCount map[string]int) string {
	handType := HighCard

	for _, count := range cardCount {
		if count == 5 {
			handType = FiveOfAKind
		}
		if count == 4 {
			handType = FourOfAKind
		}
		if count == 3 {
			if handType == OnePair {
				handType = FullHouse
			} else {
				handType = ThreeOfAKind
			}
		}
		if count == 2 {
			if handType == ThreeOfAKind {
				handType = FullHouse
			} else if handType == OnePair {
				handType = TwoPair
			} else {
				handType = OnePair
			}
		}
	}

	return handType
}

func getHandTypeScore(handType string) int {
	scores := []string{HighCard, OnePair, TwoPair, ThreeOfAKind, FullHouse, FourOfAKind, FiveOfAKind}
	for i := 0; i < len(scores); i++ {
		scoreType := scores[i]
		if scoreType == handType {
			return i
		}
	}
	return -1
}

type HandArray []Hand

func main() {
	start := time.Now()

	file, _ := os.ReadFile("d07/input.txt")
	input := string(file)
	lines := strings.Split(input, "\n")

	part1 := 0
	part2 := 0

	cardsValueMap := map[string]int{
		"2": 2,
		"3": 3,
		"4": 4,
		"5": 5,
		"6": 6,
		"7": 7,
		"8": 8,
		"9": 9,
		"T": 10,
		"J": 11,
		"Q": 12,
		"K": 13,
		"A": 14,
	}
	cardsValueMap2 := map[string]int{
		"2": 2,
		"3": 3,
		"4": 4,
		"5": 5,
		"6": 6,
		"7": 7,
		"8": 8,
		"9": 9,
		"T": 10,
		"J": 1,
		"Q": 12,
		"K": 13,
		"A": 14,
	}
	handsArray := make(HandArray, 0)
	handsArray2 := make(HandArray, 0)

	for _, line := range lines {
		if line == "" {
			continue
		}

		cardCount := make(map[string]int)
		cardCount2 := make(map[string]int)
		jCount := 0

		handData := strings.Split(line, " ")
		hand := strings.Split(handData[0], "")
		bid, _ := strconv.Atoi(handData[1])
		for i := 0; i < 5; i++ {
			card := hand[i]
			_, ok := cardCount[card]
			if !ok {
				cardCount[card] = 0
			}
			cardCount[card]++
			if card == "J" {
				jCount++
				continue
			}
			_, ok = cardCount2[card]
			if !ok {
				cardCount2[card] = 0
			}
			cardCount2[card]++
		}
		if jCount > 0 {
			if len(cardCount2) == 0 {
				cardCount2["J"] = jCount
			} else {
				maxCard := ""
				maxCount := math.MinInt
				for card, count := range cardCount2 {
					if count > maxCount {
						maxCount = count
						maxCard = card
					} else if count == maxCount {
						if maxCard == "" || cardsValueMap[card] > cardsValueMap[maxCard] {
							maxCard = card
						}
					}
				}
				cardCount2[maxCard] += jCount
			}
		}

		handType := getHandType(cardCount)
		handType2 := getHandType(cardCount2)

		handsArray = append(handsArray, Hand{cardCount: cardCount, hand: hand, bid: bid, handType: handType})
		handsArray2 = append(handsArray2, Hand{cardCount: cardCount2, hand: hand, bid: bid, handType: handType2})
	}

	sort.Slice(handsArray, func(i, j int) bool {
		a := handsArray[i]
		b := handsArray[j]

		if a.handType != b.handType {
			return getHandTypeScore(a.handType) < getHandTypeScore(b.handType)
		}

		for i := 0; i < 5; i++ {
			aCard := a.hand[i]
			bCard := b.hand[i]
			if aCard != bCard {
				return cardsValueMap[aCard] < cardsValueMap[bCard]
			}
		}

		return false
	})
	sort.Slice(handsArray2, func(i, j int) bool {
		a := handsArray2[i]
		b := handsArray2[j]

		if a.handType != b.handType {
			return getHandTypeScore(a.handType) < getHandTypeScore(b.handType)
		}

		for i := 0; i < 5; i++ {
			aCard := a.hand[i]
			bCard := b.hand[i]
			if aCard != bCard {
				return cardsValueMap2[aCard] < cardsValueMap2[bCard]
			}
		}

		return false
	})

	for i := 0; i < len(handsArray); i++ {
		hand := handsArray[i]
		hand2 := handsArray2[i]
		mul := i + 1
		part1 += hand.bid * mul
		part2 += hand2.bid * mul
	}

	fmt.Println(part1, part2)

	elapsed := time.Since(start)
	fmt.Printf("[%.2fms]\n", float64(elapsed)/1000000)
}
