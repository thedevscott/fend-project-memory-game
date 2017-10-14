/*
 * Create a list that holds all of your cards and
 * initialize variables
 */
const deck = document.getElementsByClassName('deck');
const stars = document.getElementsByClassName('stars');
const score = document.getElementsByClassName('moves');
const modal = document.getElementById("congrats");
const cards = deck[0].children;

let cardList = [];        // List of cards used
let clickedTargets = [];  // Cards clicked
let matches = 0;          // Number of matches made
let matchStart = 0;       // Time game started
let moves = 0;            // Number of moves made by user

// Get a list of the cards from the initial HTML page
for (let card of cards) {
    let name = card.children[0].className.slice(3);
    cardList.push(name);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function loadGameBoard() {
    // Reset the number of moves displayed on the page
    score[0].innerHTML = moves;

    // Re-shuffle the cards
    cardList = shuffle(cardList);

    // Clear the last deck
    while (deck[0].children.length > 0) {
        deck[0].children[0].remove();
    }
    
    let index = 0;
    // Populate deck with shuffledCards
    for (card of cardList) {
        let newCard = document.createElement('li');
        newCard.className = "card";
        newCard.id = `card_${index++}`;
    
        let item = document.createElement('i');
        item.className = `fa ${card} pos-fix`;
    
        newCard.appendChild(item);
        deck[0].appendChild(newCard);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Show the card when clicked
function showCard(target) {

    // only show unmatched cards
    if (target.className != "card match") {
        clickedTargets.push(target);

        // update the class name of simple 'card' class for displaying
        if (target.className === "card") {
            target.className = `${target.className} open show`;
        }
        else {
            target.className = "card";
        }
    }
    else {
        // ignoring matched clicks
    }
}

/**
 * Updates the star rating based on number of moves
 * 3 stars for finishing with 8 moves
 * 2 stars for finishing with 8-32 moves
 * 1 star for lowest rating
 */
function updateRating() {
    // 3 stars is the default
    if (stars[0].children[2].children[0].className === "fa fa-star" &&
        moves > 8) {
        // Remove one start for 2 star rating
        stars[0].children[2].children[0].className += "-o";
    }

    if (stars[0].children[1].children[0].className === "fa fa-star" &&
        moves > 32) {
        // Remove star for 1 star rating
        stars[0].children[1].children[0].className += "-o";
    }
}

// Function to convert milliseconds to mins:secs
// The original return value was modified to show min and secs
// Source: https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
function getYoutubeLikeToDisplay(millisec) {
    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);
    var hours = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = minutes - (hours * 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    if (hours != "") {
        return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + " min(s) and " + seconds + " secs";
}

// Checks to see if two cards match
function checkMatch() {
    let cardOne = clickedTargets.pop();
    let cardTwo = clickedTargets.pop();

    // Account for multiple clicks on the same card
    if (cardOne === cardTwo) {
        clickedTargets.pop();
        return;
     }

    if (cardOne.children[0].className ===
        cardTwo.children[0].className ) {
            // remove pos-fix from the childs classname
            const len = cardOne.children[0].className.length;
            const iconClassName = cardOne.children[0].className.substring(0, len - 7);
            cardOne.children[0].className = iconClassName;
            cardTwo.children[0].className = iconClassName;

            // Update classname for match
            const newClass = `${cardOne.className.slice(0,4)} match`;
            cardOne.className = newClass;
            cardTwo.className = newClass;
            matches++;
    }
    else {
        cardOne.className = cardOne.className.slice(0, 4);
        cardTwo.className = cardTwo.className.slice(0, 4);
    }

    // Win condition
    if (matches > 7) {
        // update modal with time and number of moves
        let modalTime = document.getElementById('win-time');
        let modalMoves = document.getElementById('win-moves');
        let modalRating = document.getElementById('win-rating');
        const matchEnd = new Date().getTime();

        // Loop through the stars and check their name
        // increment starCount for each non *-o ending
        let starCount = 0;
        for(let i = 0; i < stars[0].children.length; ++i){
            if(stars[0].children[i].children[0].className == "fa fa-star") {
                ++starCount;
            }
        }

        const timePassed = getYoutubeLikeToDisplay(matchEnd-matchStart);
        modalRating.innerHTML = `You earned a ${starCount} star rating!`;
        modalTime.innerHTML = timePassed.toString();
        modalMoves.innerHTML = moves.toString();

        // Display modal
        modal.style.display = "block";
        modal.className += " in";
    }
}

// Used to restart the game from the modal
function modalRestart() {
    closeModal();
    startGame();
}

// Start a new game be resetting relevant values and re-shuffling deck
function startGame() {
    matches = 0;
    moves = 0;
    stars[0].children[2].children[0].className = "fa fa-star";
    stars[0].children[1].children[0].className = "fa fa-star";

    loadGameBoard();
    loadListeners();
    matchStart = new Date().getTime();
}

// Used to hide the modal
function closeModal() {
    modal.style.display = "none";
    modal.className = modal.className.slice(0, -3);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function loadListeners() {
    for (let i = 0; i < deck[0].children.length; i++) {
        let id = deck[0].children[i].id;
        let element = document.getElementById(id);

        element.addEventListener('click',
            function() {
                showCard(element);
                if (clickedTargets.length > 1) {
                    moves++;
                    score[0].innerHTML = moves;
                    // Apply half a second delay so the 2nd card shows
                    setTimeout(function () {
                        checkMatch()}, 500);
                    updateRating();
                }
            });
        }
}

// setup trigger for clicking restart icon
let restart = document.getElementsByClassName('restart');
restart[0].addEventListener('click',
    function() {
        startGame();
    });

startGame();