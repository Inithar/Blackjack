import { Deck } from "./Deck.js";
import { Player } from "./Player.js";
import { Table } from "./Table.js";

class Game {
  constructor({
    chipBtns,
    betHtmlElement,
    dealBtn,
    cashHtmlElement,
    table,
    playerPoints,
    dealerPoints,
    chipsBtnsBox,
    movesBtnsBox,
    movesBtns,
    resultScreen,
    backOfCard,
  }) {
    this.chipBtns = chipBtns;
    this.betHtmlElement = betHtmlElement;
    this.dealBtn = dealBtn;
    this.cashHtmlElement = cashHtmlElement;
    this.player = new Player("Szymon", 500);
    this.dealer = new Player("Krupier");
    this.deck;
    this.table = table;
    this.playerPoints = playerPoints;
    this.dealerPoints = dealerPoints;
    this.chipsBtnsBox = chipsBtnsBox;
    this.movesBtnsBox = movesBtnsBox;
    this.movesBtns = movesBtns;
    this.isDoubleDown = false;
    this.resultScreen = resultScreen;
    this.backOfCard = backOfCard;
  }

  init() {
    const standBtn = this.movesBtns[0];
    const hitBtn = this.movesBtns[1];
    const doubleDownBtn = this.movesBtns[2];
    const playAgainBtn = this.resultScreen.querySelector(
      ".modal__play-again-btn"
    );

    this.chipBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = parseInt(btn.textContent.split("$")[1]);
        if (this.checkBet(value)) {
          this.player.bet.increase(value);
          this.updateBetView();
        }
      });
    });

    this.dealBtn.addEventListener("click", () => {
      this.updateCashView();
      this.dealCards();
      this.diplayMovesBtns();
    });

    standBtn.addEventListener("click", () => this.dealerPlays());
    hitBtn.addEventListener("click", () => this.hitCard());
    doubleDownBtn.addEventListener("click", () => {
      this.isDoubleDown = true;
      this.doubleDown();
    });

    playAgainBtn.addEventListener("click", () => this.playAgain());

    this.updateCashView();
    this.newDeck();
  }

  newDeck() {
    this.deck = new Deck();
    this.deck.shuffle();
  }

  updateCashView(isDoubleDown) {
    let betValue = this.player.bet.getValue();
    betValue = isDoubleDown ? betValue / 2 : betValue;
    this.player.updateCashAfterBet(betValue);
    this.cashHtmlElement.textContent = `Cash: $${this.player.getCash()}`;
  }

  updateBetView() {
    this.betHtmlElement.textContent = `Bet: $${this.player.bet.getValue()}`;
  }

  checkBet(value) {
    const betValue = this.player.bet.getValue() + value;
    const playerCash = this.player.getCash();

    if (playerCash >= betValue) {
      this.dealBtn.classList.remove("unbind-click");
      return true;
    }

    return false;
  }

  dealCards() {
    for (let i = 0; i < 2; i++) {
      let playerCard = this.deck.pickOne();
      this.player.hand.addCard(playerCard);
      this.table.showPlayersCard(playerCard);

      let dealerCard = this.deck.pickOne();
      this.dealer.hand.addCard(dealerCard);
      this.table.showDealersCard(dealerCard);
    }

    this.backOfCard.classList.add("back-of-card--visible");
    this.setPlayerScore();
    this.setDealerScore(false, true);
  }

  diplayMovesBtns() {
    const betValue = this.player.bet.getValue();
    const doubleDownBtn = this.movesBtns[2];
    if (!this.checkBet(betValue)) doubleDownBtn.classList.add("unbind-click");

    this.chipsBtnsBox.classList.add("chips--hidden");
    this.movesBtnsBox.classList.remove("player-moves-btns--hidden");
  }

  displayChipsBtns() {
    this.chipsBtnsBox.classList.remove("chips--hidden");
    this.movesBtnsBox.classList.add("player-moves-btns--hidden");
  }

  setPlayerScore(reset) {
    const score = reset ? 0 : this.player.calculatePoints();
    this.playerPoints.textContent = `Score ${score}`;
  }

  setDealerScore(reset, hiddenCard) {
    let displayScore = 0;

    if (!reset) {
      displayScore = hiddenCard
        ? this.dealer.showDealerPointsWithHiddenCard()
        : this.dealer.calculatePoints();
    }

    this.dealerPoints.textContent = `Score ${displayScore}`;
  }

  hitCard() {
    const card = this.deck.pickOne();
    this.player.hand.addCard(card);
    this.table.showPlayersCard(card);
    this.setPlayerScore();
    this.checkNumberOfCardsInHand();
    this.isBust();
  }

  checkNumberOfCardsInHand() {
    const numberOfCardsInHand = this.player.hand.cards.length;
    const doubleDownBtn = this.movesBtns[2];

    if (numberOfCardsInHand > 2 && !this.isDoubleDown)
      doubleDownBtn.classList.add("unbind-click");
  }

  doubleDown() {
    this.player.bet.increase(this.player.bet.getValue());
    this.betHtmlElement.textContent = `Bet: $${this.player.bet.getValue()}`;
    this.updateCashView(true);
    this.hitCard();

    if (!this.isBust()) {
      this.dealerPlays();
    }
  }

  dealerPlays() {
    this.backOfCard.classList.remove("back-of-card--visible");
    this.setDealerScore();

    while (this.dealer.points < this.player.points && this.dealer.points < 21) {
      const card = this.deck.pickOne();
      this.dealer.hand.addCard(card);
      this.table.showDealersCard(card);
      this.setDealerScore();
    }

    this.endTheGame();
  }

  showResultScreen(result) {
    const betElement = this.resultScreen.querySelector(".modal__bet-result");
    const cashElement = this.resultScreen.querySelector(".modal__cash");
    let playerCash = this.player.getCash();
    let betValue = this.player.bet.getValue();
    let text = result === "win" ? "You win" : "You lost";

    if (result === "win") {
      betValue *= 2;
      playerCash += betValue;
    }

    if (result === "draw") {
      text = "Draw, you get the equivalent of the bet";
      playerCash += betValue;
    }

    this.player.setCash(playerCash);
    betElement.textContent = `${text} $${betValue}`;
    cashElement.textContent = `You currently have $${playerCash}`;
    this.resultScreen.classList.remove("modal--hide");
  }

  isBust() {
    if (this.player.points > 21) {
      this.backOfCard.classList.remove("back-of-card--visible");
      this.setDealerScore();
      this.showResultScreen("lost");
      return true;
    }

    return false;
  }

  endTheGame() {
    if (this.player.points < 21 && this.player.points == this.dealer.points) {
      this.showResultScreen("draw");
      return;
    }

    if (this.dealer.points > 21) {
      this.showResultScreen("win");
      return;
    }

    if (this.player.points < this.dealer.points) {
      this.showResultScreen("lost");
      return;
    }
  }

  playAgain() {
    const doubleDownBtn = this.movesBtns[2];
    this.displayChipsBtns();
    this.player.bet.newBet();
    this.updateCashView();
    this.updateBetView();
    this.player.hand.newHand();
    this.dealer.hand.newHand();
    this.table.clearTable();
    this.setPlayerScore(true);
    this.setDealerScore(true);
    this.isDoubleDown = false;
    doubleDownBtn.classList.remove("unbind-click");
    this.resultScreen.classList.add("modal--hide");
    this.dealBtn.classList.add("unbind-click");
    if (this.deck.cards.length <= 12) this.newDeck();
  }
}

const table = new Table(
  document.querySelector(".player__cards--left"),
  document.querySelector(".player__cards--right")
);

const game = new Game({
  chipBtns: document.querySelectorAll(".chip-btn"),
  betHtmlElement: document.querySelector(".player-info__bet"),
  dealBtn: document.querySelector(".deal-btn"),
  cashHtmlElement: document.querySelector(".player-info__cash"),
  table,
  playerPoints: document.querySelectorAll(".player__score")[0],
  dealerPoints: document.querySelectorAll(".player__score")[1],
  chipsBtnsBox: document.querySelector(".chips"),
  movesBtnsBox: document.querySelector(".player-moves-btns"),
  movesBtns: document.querySelectorAll(".move-btn"),
  resultScreen: document.querySelector(".modal"),
  backOfCard: document.querySelector(".back-of-card"),
});

game.init();
