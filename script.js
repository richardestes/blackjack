//
// Blackjack Application
// by Richard Estes
//

//Card Variables
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
let values = [
  "Ace",
  "King",
  "Queen",
  "Jack",
  "Ten",
  "Nine",
  "Eight",
  "Seven",
  "Six",
  "Five",
  "Four",
  "Three",
  "Two"
];

//DOM Variables
let textArea = document.getElementById("text-area"),
  newGameButton = document.getElementById("new-game-button"),
  hitButton = document.getElementById("hit-button"),
  stayButton = document.getElementById("stay-button");

//Game Variables
let gameStarted = false,
  gameOver = false,
  playerWon = false,
  dealerCards = [],
  playerCards = [],
  dealerCardsImages = [],
  playerCardsImages = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

hitButton.style.display = "none";
stayButton.style.display = "none";
showStatus();

newGameButton.addEventListener("click", function () {
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  playerCards = [];
  dealerCards = [];

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  for (let i = 0; i < dealerCards.length; i++) {
    var matchingCardValue = getCardValueFile(dealerCards[i].value);
    var matchingCardSuit = getCardSuitFile(dealerCards[i].suit);
    var matchingCardFile = matchingCardValue + matchingCardSuit + '.png';
    dealerCardsImages.push(matchingCardFile);
    show_image("images/" + matchingCardFile, 173, 264);
  }
  playerCards = [getNextCard(), getNextCard()];
  for (let i = 0; i < playerCards.length; i++) {
    var matchingCardValue = getCardValueFile(playerCards[i].value);
    var matchingCardSuit = getCardSuitFile(playerCards[i].suit);
    var matchingCardFile = matchingCardValue + matchingCardSuit + '.png';
    playerCardsImages.push(matchingCardFile);
    show_image("images/" + matchingCardFile, 173, 264);
  }

  newGameButton.style.display = "none";
  hitButton.style.display = "inline";
  stayButton.style.display = "inline";
  showStatus();
});

hitButton.addEventListener('click', function () {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  var matchingCardValue = getCardValueFile(playerCards[playerCards.length - 1].value);
  var matchingCardSuit = getCardSuitFile(playerCards[playerCards.length - 1].suit);
  var matchingCardFile = matchingCardValue + matchingCardSuit + '.png';
  show_image("images/" + matchingCardFile, 173, 264);
  showStatus();
});

stayButton.addEventListener('click', function () {
  gameOver = true;
  checkForEndOfGame();
  // var matchingCardValue = getCardValueFile(dealerCards[dealerCards.length - 1].value);
  // var matchingCardSuit = getCardSuitFile(dealerCards[dealerCards.length - 1].suit);
  // var matchingCardFile = matchingCardValue + matchingCardSuit + '.png';
  // show_image("images/" + matchingCardFile, 123, 264);
  showStatus();
});

function show_image(src, width, height) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;

  document.body.appendChild(img);
}

function createDeck() {
  let deck = [];
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
    for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
      let card = {
        suit: suits[suitIndex],
        value: values[valueIndex]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIndex = Math.trunc(Math.random() * deck.length);
    let temp = deck[swapIndex];
    deck[swapIndex] = deck[i];
    deck[i] = temp;
  }
}

function getNextCard() {
  return deck.shift(); // takes first value and shifts remaining cards
}

function getCardString(card) {
  return card.value + " of " + card.suit;
}

function getCardValueFile(value) {
  switch (value) {
    case "Ace":
      return 'A';
    case "Two":
      return '2';
    case "Three":
      return '3';
    case "Four":
      return '4';
    case "Five":
      return '5';
    case "Six":
      return '6';
    case "Seven":
      return '7';
    case "Eight":
      return '8';
    case "Nine":
      return '9';
    case "Ten":
      return '10';
    case "Jack":
      return 'J';
    case "Queen":
      return 'Q';
    case "King":
      return 'K';
  }
}

function getCardSuitFile(suit) {
  switch (suit) {
    case "Hearts":
      return 'H';
    case "Clubs":
      return 'C';
    case "Diamonds":
      return 'D';
    case "Spades":
      return 'S';
  }

}

function showStatus() {
  if (!gameStarted) {
    textArea.innerText = "Welcome to Blackjack" + "\n";
    return;
  }

  let dealerCardString = "";
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + "\n";
  }

  let playerCardString = "";
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + "\n";
  }

  updateScores();

  textArea.innerText =
    "Dealer has:\n" +
    dealerCardString +
    "(score: " +
    dealerScore +
    ")\n\n" +
    "Player has:\n" +
    playerCardString +
    "(score: " +
    playerScore +
    ")\n\n";

  if (gameOver) {
    if (playerWon) textArea.innerText += "You win!";
    else textArea.innerText += "Dealer wins!";

    newGameButton.style.display = "inline";
    hitButton.style.display = "none";
    stayButton.style.display = "none";

  }

  //Display deck
  // for (var i = 0; i < deck.length; i++) {
  //     textArea.innerText += '\n' + getCardString(deck[i]);
  // }
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
  updateScores();

  if (gameOver) {
    while (
      dealerScore < playerScore &&
      playerScore <= 21 &&
      dealerScore <= 21
    ) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  } else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  } else if (gameOver) {
    if (playerScore > dealerScore) playerWon = true;
    else playerWon = false;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === "Ace") {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) return score + 10;

  return score;
}

function getCardNumericValue(card) {
  switch (card.value) {
    case "Ace":
      return 1;
    case "Two":
      return 2;
    case "Three":
      return 3;
    case "Four":
      return 4;
    case "Five":
      return 5;
    case "Six":
      return 6;
    case "Seven":
      return 7;
    case "Eight":
      return 8;
    case "Nine":
      return 9;
    default:
      return 10;
  }
}