import { Hand } from "./Hand.js";
import { Bet } from "./Bet.js";

export class Player {
  constructor(name, cash) {
    this.name = name;
    this.cash = cash;
    this.points = 0;
    this.hand = new Hand();
    this.bet = new Bet(0);
  }

  getCash() {
    if (this.cash <= 0) this.cash = 0;
    return this.cash;
  }

  setCash(value) {
    this.cash = value;
  }

  updateCashAfterBet(value) {
    const cash = this.cash - value;
    this.cash = cash;
  }

  calculatePoints() {
    this.points = this.hand.getStrength(false);
    return this.points;
  }

  showDealerPointsWithHiddenCard() {
    return this.hand.getStrength(true);
  }
}
