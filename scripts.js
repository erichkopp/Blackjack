// 
// Blackjack
// by Erich Kopp
// 

// Card Variables
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"]
let values = ["Ace", "King", "Queen", "Jack", "Ten", "Nine",
	"Eight", "Seven", "Six", "Five", "Four", "Three", "Two"];

// DOM Variables
let textArea = document.getElementById("text-area");
let newGameButton = document.getElementById("new-game-button");
let hitButton = document.getElementById("hit-button");
let stayButton = document.getElementById("stay-button");

// Game Variables
let gameStarted = false,
		gameOver = false,
		playerWon = false,
		dealerWon = false,
		tieGame = false,
		dealerCards = [],
		playerCards = [],
		dealerScore = [],
		playerScore = [],
		deck = [];

hitButton.style.display = "none";
stayButton.style.display = "none";
showStatus();

newGameButton.addEventListener("click", function() {
	gameStarted = true;
	gameOver = false;
	playerWon = false;
	dealerWon = false;
	tieGame = false;

	deck = createDeck();
	shuffleDeck(deck);
	dealerCards = [ getNextCard(), getNextCard() ];
	playerCards = [ getNextCard(), getNextCard() ];

	newGameButton.style.display = "none";
	hitButton.style.display = "inline";
	stayButton.style.display = "inline";
	showStatus();
});

hitButton.addEventListener("click", function() {
	playerCards.push(getNextCard());
	checkForEndOfGame();
	showStatus();
});

stayButton.addEventListener("click", function() {
	gameOver = true;
	checkForEndOfGame();
	showStatus();
});

// Build a deck of the 52 cards we need
// by looping through suits and corresponding values
function createDeck() {
	let deck = [];
	for (let suitIdx=0; suitIdx<suits.length; suitIdx++) {
		for (let valueIdx=0; valueIdx<values.length; valueIdx++) {
			let card = {
				suit: suits[suitIdx],
				value: values[valueIdx]
			};
		deck.push(card);
		// deck.push(valueIdx + " of " + suitIdx);     // gives index # of each, but need to use that # to reference which suit/value it corresponds to in each suit/value array suit[0] + value[0], etc
		}
	}
	return deck;
}

// Creates a random number (0-51) and rounds to nearest whole number
// Uses that random number to index another card in the deck
// Swaps that random index with the i index
// Loops through for every card and deck is now shuffled
function shuffleDeck(deck) {
	for (let i=0; i<deck.length; i++) {
		let swapIdx = Math.trunc(Math.random() * deck.length); //25
		let tmp = deck[swapIdx]; //tmp = deck[25]
		deck[swapIdx] = deck[i]; //deck[25] = deck[0]
		deck[i] = tmp; //deck[0] = deck[25]
	}
}

// Returns Queen of Hearts, etc as  string for the Object
function getCardString(card) {
	return card.value + " of " + card.suit;
}

// Take the next card off the top of the deck array
function getNextCard() {
	return deck.shift();
}

function getCardNumericValue(card) {
	switch(card.value) {
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
			return 9
		default:
			return 10;
	}
}

function getScore(cardArray) {
	let score = 0;
	let hasAce = false;
	for (let i=0; i<cardArray.length; i++) {
		let card = cardArray[i];
		score += getCardNumericValue(card);
		if (card.value === "Ace") {
			hasAce = true;
		}
	}
	if (hasAce && score + 10 <= 21) {
		return score + 10;
	}
	return score;
}

function updateScores() {
	dealerScore = getScore(dealerCards);
	playerScore = getScore(playerCards);

	if (playerScore === 21 || dealerScore === 21) {
		if (playerScore > dealerScore) {
			playerWon = true;
			gameOver = true;
		}
		else {
			dealerWon = true;
			gameOver = true;
		}
	}
}

function checkForEndOfGame() {

	updateScores();

	if (gameOver) {
		// Let dealer take cards
		while (dealerScore < playerScore
					&& playerScore <= 21
					&& dealerScore <= 21) {
			dealerCards.push(getNextCard());
			updateScores();
		}
	}
	if (playerScore > 21) {
		dealerWon = true;
		gameOver = true;
	}
	else if (dealerScore > 21) {
		playerWon = true;
		gameOver = true;
	}
	else if (gameOver) {
		if (playerScore === dealerScore) {
			tieGame = true;
		}
		else if (playerScore > dealerScore) {
			playerWon = true;
		}
		else if (dealerScore > playerScore) {
			dealerWon = true;
		}
	}
}

function showStatus() {
	if (!gameStarted) {
		textArea.innerText = "Welcome to Blackjack!";
		return;
	}

	let dealerCardString = "";
	for (let i=0; i<dealerCards.length; i++) {
		dealerCardString += getCardString(dealerCards[i]) + "\n";
	}

	let playerCardString = "";
	for (let i=0; i<playerCards.length; i++) {
		playerCardString += getCardString(playerCards[i]) + "\n";
	}

	updateScores();

	textArea.innerText =
		"Dealer has:\n" +
		dealerCardString +
		"(score: " + dealerScore + ")\n\n" +
  
		"Player has:\n" +
		playerCardString +
		"(score: " + playerScore + ")\n\n";

	if (gameOver) {
		if (playerWon) {
			textArea.innerText += "YOU WIN!";
		}
		else if (tieGame) {
			textArea.innerText += "TIE!"
		}
		else {
			textArea.innerText += "DEALER WINS";
		}
		newGameButton.style.display = "inline";
		hitButton.style.display = "none";
		stayButton.style.display = "none";
	}


// // Loop through all cards to see if shuffled
	// for (var i=0; i<deck.length; i++) {
	// 	textArea.innerText += '\n' + getCardString(deck[i]);
	// }
}






// console.log("Welcome to Blackjack!");

// console.log("You are dealt: ");
// console.log(" " + getCardString(playerCards[0]) );
// console.log(" " + getCardString(playerCards[1]) );



// // Using for-loop to list all cards for hand of any amount of cards
// console.log("Welcome to Blackjack!");
// console.log("You are dealt: ")
// for (let i=0; i<playerCards.length; i++) {
// 	console.log(" " + playerCards[i]);
// }