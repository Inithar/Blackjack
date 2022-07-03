export const Weights = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

export const Types = ["spades", "hearts", "diamonds", "clubs"];

export class Card {
  mapTextToSign = {
    hearts: "♥",
    spades: "♠",
    diamonds: "♦",
    clubs: "♣",
  };

  constructor(weight, type) {
    this.weight = weight;
    this.type = type;
  }

  render() {
    const card = document.createElement("div");
    const typeSymbol = this.mapTextToSign[this.type];
    card.setAttribute("class", `card ${this.type}`);
    card.setAttribute("data-card-value", `${this.weight}${typeSymbol}`);
    card.textContent = typeSymbol;

    return card;
  }
}
