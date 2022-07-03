export class Table {
  constructor(playersCards, dealersCards) {
    this.playersCards = playersCards;
    this.dealersCards = dealersCards;
  }

  showPlayersCard(card) {
    this.playersCards.append(card.render());
  }

  showDealersCard(card) {
    this.dealersCards.append(card.render());
  }

  clearTable() {
    this.playersCards.innerHTML = "";
    this.dealersCards.innerHTML = "";
  }
}
