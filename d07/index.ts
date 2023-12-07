import { readFileSync } from "fs-extra";

console.time("");

const input = readFileSync("d07/input.txt", "utf-8").toString();
const lines = input.split("\n");
let part1 = 0;
let part2 = 0;

const cardsValueMap: Record<string, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};
const cardsValueMap2: Record<string, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 1,
  Q: 12,
  K: 13,
  A: 14,
};
type HandType =
  | "fiveOfAKind"
  | "fourOfAKind"
  | "fullHouse"
  | "threeOfAKind"
  | "twoPair"
  | "onePair"
  | "highCard";
const handsArray: {
  cardCount: Record<string, number>;
  hand: string;
  bid: number;
  type: HandType;
}[] = [];
const handsArray2: {
  cardCount: Record<string, number>;
  hand: string;
  bid: number;
  type: HandType;
}[] = [];

const getType = (cardCount: Record<string, number>) => {
  let type: HandType = "highCard";
  Object.values(cardCount).forEach((count) => {
    if (count === 5) {
      type = "fiveOfAKind";
    }
    if (count === 4) {
      type = "fourOfAKind";
    }
    if (count === 3) {
      if (type === "onePair") {
        type = "fullHouse";
      } else {
        type = "threeOfAKind";
      }
    }
    if (count === 2) {
      if (type === "threeOfAKind") {
        type = "fullHouse";
      } else if (type === "onePair") {
        type = "twoPair";
      } else {
        type = "onePair";
      }
    }
  });
  return type;
};

lines.forEach((line) => {
  if (!line) {
    return;
  }

  const cardCount: Record<string, number> = {};
  const cardCount2: Record<string, number> = {};

  const [hand, bidStr] = line.split(" ");
  const bid = Number(bidStr);

  let jCount = 0;
  for (let i = 0; i < 5; i++) {
    const card = hand[i];
    if (!cardCount[card]) {
      cardCount[card] = 0;
    }
    cardCount[card]++;
    if (card === "J") {
      jCount++;
      continue;
    }
    if (!cardCount2[card]) {
      cardCount2[card] = 0;
    }
    cardCount2[card]++;
  }
  if (jCount > 0) {
    const cardEntries = Object.entries(cardCount2);
    if (cardEntries.length === 0) {
      cardCount2["J"] = jCount;
    } else {
      const maxCard = cardEntries.sort(([aCard, aCount], [bCard, bCount]) => {
        if (aCount !== bCount) {
          return bCount - aCount;
        }
        return cardsValueMap[bCard] - cardsValueMap[aCard];
      })[0][0];
      cardCount2[maxCard] += jCount;
    }
  }

  const type = getType(cardCount);
  const type2 = getType(cardCount2);

  handsArray.push({
    cardCount,
    hand,
    bid,
    type,
  });
  handsArray2.push({
    cardCount: cardCount2,
    hand,
    bid,
    type: type2,
  });
});

const sorter =
  (valueMap: Record<string, number>) =>
  (a: (typeof handsArray)[number], b: (typeof handsArray)[number]) => {
    if (a.type !== b.type) {
      return (
        [
          "highCard",
          "onePair",
          "twoPair",
          "threeOfAKind",
          "fullHouse",
          "fourOfAKind",
          "fiveOfAKind",
        ].indexOf(a.type) -
        [
          "highCard",
          "onePair",
          "twoPair",
          "threeOfAKind",
          "fullHouse",
          "fourOfAKind",
          "fiveOfAKind",
        ].indexOf(b.type)
      );
    }
    for (let i = 0; i < 5; i++) {
      const aCard = a.hand[i];
      const bCard = b.hand[i];
      if (aCard !== bCard) {
        return valueMap[aCard] - valueMap[bCard];
      }
    }
    return 0;
  };
const reducer = (
  acc: number,
  hand: (typeof handsArray)[number],
  index: number,
) => acc + hand.bid * (index + 1);

handsArray.sort(sorter(cardsValueMap));
handsArray2.sort(sorter(cardsValueMap2));

part1 += handsArray.reduce(reducer, 0);
part2 += handsArray2.reduce(reducer, 0);

console.log(part1, part2);

console.timeEnd("");
