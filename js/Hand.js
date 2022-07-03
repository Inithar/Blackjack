export class Hand {
  constructor() {
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  countCardsByWeight(weight) {
    return this.cards.filter((card) => card.weight == weight).length;
  }

  getCardWeight(card) {
    const numberOfCardsInHand = this.cards.length;

    if (["K", "Q", "J"].includes(card.weight)) {
      return 10;
    }

    if (numberOfCardsInHand == 2 && card.weight == "A") {
      return 11;
    }

    if (numberOfCardsInHand > 2 && card.weight == "A") {
      return 1;
    }

    return parseInt(card.weight);
  }

  getStrength(hiddeCard) {
    const cards = this.cards.map((card) => this.getCardWeight(card));

    let strength = cards.reduce(function (sum, weight) {
      return parseInt(sum) + parseInt(weight);
    });

    if (this.countCardsByWeight("A") == 2 && this.cards.length == 2) {
      strength = 21;
    }

    if (hiddeCard) return strength - this.getCardWeight(this.cards[1]);

    return strength;
  }

  newHand() {
    this.cards = [];
  }
}
