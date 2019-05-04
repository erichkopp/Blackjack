// 
// Blackjack
// by Erich Kopp
// 

// Card Variables
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"]
let values = ["A", "K", "Q", "J", "10", "9",
	"8", "7", "6", "5", "4", "3", "2"];

// DOM Variables
let newGameButton = document.getElementById("new-game-button");
let hitButton = document.getElementById("hit-button");
let stayButton = document.getElementById("stay-button");
let dealerScoreBoard = document.getElementById("dealer-score-board");
let playerScoreBoard = document.getElementById("player-score-board");
let tableCards = document.getElementsByClassName("table-cards");
let gameNotifications = document.getElementById("game-notifications")


// Stack Overflow code to remove elements by class name
// Used with New Game/Hit/Stay buttons to clean slate and only show current cards
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// Game Variables
let gameStarted = false,
		gameOver = false,
		playerWon = false,
		dealerWon = false,
		tieGame = false,
		gameButtonsClicked = false,
		dealerCards = [],
		playerCards = [],
		dealerScore = [],
		playerScore = [],
		deck = [];

hitButton.style.display = "none";
stayButton.style.display = "none";

// Hide the playing table
for (var i=0; i<tableCards.length; i++) {
	tableCards[i].className += " hidden";
}

showStatus();



newGameButton.addEventListener("click", function() {
	gameStarted = true;
	gameOver = false;
	playerWon = false;
	dealerWon = false;
	tieGame = false;
	gameButtonsClicked = false;

	document.getElementById("title").style.color = "white";
	document.getElementById("by_erich").style.display = "none";
	document.getElementsByClassName("cards").remove();
	gameNotifications.style.display ="none";
	document.getElementById("wrapper").style.background = "#15843f";
	
	showFaceDownCard();

	deck = createDeck();
	shuffleDeck(deck);
	dealerCards = [ getNextCard(), getNextCard() ];
	playerCards = [ getNextCard(), getNextCard() ];

	// Show Dealer's second card facedown
	let faceDownCard = document.createElement("div");
	faceDownCard.id = "face-down-card";
	document.getElementById("dealer-cards").appendChild(faceDownCard);

	newGameButton.style.display = "none";
	hitButton.style.display = "inline";
	stayButton.style.display = "inline";
	// Show the playing table
	for (var i=0; i<tableCards.length; i++) {
	tableCards[i].className = "table-cards";
	}
	showStatus();
});

hitButton.addEventListener("click", function() {
	gameButtonsClicked = true;
	document.getElementsByClassName("cards").remove();
	showFaceDownCard();

	playerCards.push(getNextCard());


	// if (dealerScore < playerScore
	// 	&& playerScore <= 21
	// 	&& dealerScore < 21) {
	// 	dealerCards.push(getNextCard());
	// 	updateScores();
	// }
	if (dealerScore < 17 && playerScore <= 21) {
		dealerCards.push(getNextCard());
	}
	checkForEndOfGame();
	showStatus();
});

stayButton.addEventListener("click", function() {
	gameButtonsClicked = true;
	document.getElementsByClassName("cards").remove();
	showFaceDownCard();

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

// Shows dealer's second card
function showFaceDownCard() {
	if ( document.getElementById("face-down-card") ) {
		document.getElementById("face-down-card").remove();
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
		case "A":
			return 1;
		case "2":
			return 2;
		case "3":
			return 3;
		case "4":
			return 4;
		case "5":
			return 5;
		case "6":
			return 6;
		case "7":
			return 7;
		case "8":
			return 8;
		case "9":
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
		if (card.value === "A") {
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
		if (playerScore === dealerScore) {
			tieGame = true;
			gameOver = true;
			showFaceDownCard();
		}
		else if (playerScore > dealerScore && playerScore <= 21) {
			playerWon = true;
			gameOver = true;
			showFaceDownCard();
		}
		else if (dealerScore > playerScore && dealerScore <= 21 && gameButtonsClicked) {
			dealerWon = true;
			gameOver = true;
			showFaceDownCard();
		}
	}
}

function checkForEndOfGame() {

	updateScores();

	if (gameOver) {
		// // Let dealer take cards
		// while (dealerScore < playerScore
		// 			&& playerScore <= 21
		// 			&& dealerScore <= 21) {
		// 	dealerCards.push(getNextCard());
		// 	updateScores();
		// }
		while (dealerScore < 17 && playerScore <= 21) {
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
			playerWon = false;
			dealerWon = false;
		}
		else if (playerScore > dealerScore) {
			playerWon = true;
		}
		else if (dealerScore > playerScore) {
			dealerWon = true;
		}
	}
}

// function dealersPlay () {
// 		updateScores();
// 	if (dealerScore <= 16 && playerScore <= 21) {
// 		dealerCards.push(getNextCard());
// 		updateScores();
// 	}
// }

function showStatus() {
	if (!gameStarted) {
		document.getElementById("wrapper").style.background = "white";
		return;
	}

// Creates Cards on table in individual divs
// For Dealer and Player
// Reversed order of Dealer and Player blocks because style.color was acting weird. Somehow fixed by reversing?
for (let i=0; i<playerCards.length; i++) {
	let cardDiv = "";
	cardDiv = document.createElement("div");
	cardDiv.id = "player-card" + [i];
	cardDiv.className = "cards";
	document.getElementById("player-cards").appendChild(cardDiv);
}

for (let i=0; i<playerCards.length; i++) {
	suitDiv = document.createElement("div");
	suitDiv.id = "suit" + [i];
	suitDiv.className = "suits";
	document.getElementById("player-card" + [i]).appendChild(suitDiv);

	if (playerCards[i].suit === "Clubs") {
		suitDiv.innerText = playerCards[i].value;
		suitDiv.innerHTML += "<i class='suit-upper-left'>" + "&#9827;" + "</i>";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "&#9827;";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "<div class='contrast-card'>" + "&#9827;" + "</div>"; // Contrasting Left Side
	}
	else if (playerCards[i].suit === "Spades") {
		suitDiv.innerText = playerCards[i].value;
		suitDiv.innerHTML += "<i class='suit-upper-left'>" + "&#9824;" + "</i>";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "&#9824;";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "<div class='contrast-card'>" + "&#9824;" + "</div>"; // Contrasting Left Side
	}
	else if (playerCards[i].suit === "Hearts") {
		suitDiv.innerText = playerCards[i].value;
		suitDiv.innerHTML += "<i class='suit-upper-left'>" + "&#9829;" + "</i>";
		suitDiv.style.color = "red";
		document.getElementById(suitDiv.id).parentElement.style.color = "red";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "&#9829;";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "<div class='contrast-card'>" + "&#9829;" + "</div>"; // Contrasting Left Side
	}
	else if (playerCards[i].suit === "Diamonds") {
		suitDiv.innerText = playerCards[i].value;
		suitDiv.innerHTML += "<i class='suit-upper-left'>" + "&#9830;" + "</i>";
		suitDiv.style.color = "red";
		document.getElementById(suitDiv.id).parentElement.style.color = "red";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "&#9830;";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "<div class='contrast-card'>" + "&#9830;" + "</div>"; // Contrasting Left Side
	}			
}

for (let i=0; i<dealerCards.length; i++) {
	let cardDiv = "";
	cardDiv = document.createElement("div");
	cardDiv.id = "dealer-card" + [i];
	cardDiv.className = "cards";
	document.getElementById("dealer-cards").appendChild(cardDiv);
}

for (let i=0; i<dealerCards.length; i++) {	
	suitDiv = document.createElement("div");
	suitDiv.id = "suit" + [i];
	suitDiv.className = "suits";
	document.getElementById("dealer-card" + [i]).appendChild(suitDiv);

	if (dealerCards[i].suit === "Clubs") {
		suitDiv.innerText = dealerCards[i].value;
		suitDiv.innerHTML += "<i class='suit-upper-left'>" + "&#9827;" + "</i>";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "&#9827;";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "<div class='contrast-card'>" + "&#9827;" + "</div>"; // Contrasting Left Side
	}
	else if (dealerCards[i].suit === "Spades") {
		suitDiv.innerText = dealerCards[i].value;
		suitDiv.innerHTML += "<i class='suit-upper-left'>" + "&#9824;" + "</i>";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "&#9824;";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "<div class='contrast-card'>" + "&#9824;" + "</div>"; // Contrasting Left Side
	}
	else if (dealerCards[i].suit === "Hearts") {
		suitDiv.innerText = dealerCards[i].value;
		suitDiv.innerHTML += "<i class='suit-upper-left'>" + "&#9829;" + "</i>";
		suitDiv.style.color = "red";
		document.getElementById(suitDiv.id).parentElement.style.color = "red";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "&#9829;";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "<div class='contrast-card'>" + "&#9829;" + "</div>"; // Contrasting Left Side
	}
	else if (dealerCards[i].suit === "Diamonds") {
		suitDiv.innerText = dealerCards[i].value;
		suitDiv.innerHTML += "<i class='suit-upper-left'>" + "&#9830;" + "</i>";
		suitDiv.style.color = "red";
		document.getElementById(suitDiv.id).parentElement.style.color = "red";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "&#9830;";
		document.getElementById(suitDiv.id).parentElement.innerHTML += "<div class='contrast-card'>" + "&#9830;" + "</div>"; // Contrasting Left Side
	}			
}



updateScores();



// Show scores. Only show score of dealer's first card on first turn
// Once Hit or Stay button clicked show Dealer's full/true score to Player

function tempScore () {
	if (dealerCards[0].value === "A") {
		return 11
	}
	else {
		return getCardNumericValue(dealerCards[0]);
	}
}


if (gameButtonsClicked) {
	dealerScoreBoard.innerText = "Score: " + dealerScore;
}
else {
	dealerScoreBoard.innerText = "Score: " + tempScore();
	// dealerScoreBoard.innerText = "Score: " + getCardNumericValue(dealerCards[0]);
}

playerScoreBoard.innerText = "Score: " + playerScore;








	if (gameOver) {
		gameNotifications.style.display ="block";
		gameNotifications.style.width ="100%";
		if (playerWon) {
			gameNotifications.innerText = "YOU WIN!";
		}
		else if (dealerScore > 21 && playerScore > 21) {
			gameNotifications.innerText = "BUST!"
		}
		else if (tieGame) {
			gameNotifications.innerText = "TIE!"
		}
		else if (dealerWon) {
			gameNotifications.innerText = "DEALER WINS";
		}

		newGameButton.style.display = "inline";
		hitButton.style.display = "none";
		stayButton.style.display = "none";
	}








}








// function dealersPlay () {

// 	if (dealerScore <= 17) {
// 		// Dealer Stays
// 	}
// 	else if (dealerScore <= 16) {
// 		// Dealer takes a card
// 	}
// 	else if (dealerHasAce) {
// 		// if counting ace as 11 brings total >= 17 && <= 21
// 		// dealer stays
// 	}

// }





