export class Bet {
  constructor(value) {
    this.value = value;
  }

  increase(value) {
    this.value += value;
  }

  getValue() {
    return this.value;
  }

  newBet() {
    this.value = 0;
  }
}
