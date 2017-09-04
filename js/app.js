/*
 * Create a list that holds all of your cards
 */
const deck = document.getElementsByClassName('deck');
const cards = deck[0].children;
let cardList = [];
let clickedTargets = [];
let matches = 0;

for(let card of cards){
    let name = card.children[0].className.slice(3);
    cardList.push(name);
}
console.log(cardList);
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
cardList = shuffle(cardList);

console.log(cardList);

// Clear the initial list
while(deck[0].children.length > 0) {
    deck[0].children[0].remove();
}

let index = 0;
// Populate deck with shuffledCards
for(card of cardList) {
    let newCard = document.createElement('li');
    newCard.className = "card";
    newCard.id = `card_${index++}`;

    let item = document.createElement('i');
    item.className = `fa ${card}`;

    newCard.appendChild(item);
    deck[0].appendChild(newCard);
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

function showCard(target) {

    // Ignore existing matches
    if (target.className != "card match") {
        clickedTargets.push(target);

        if(target.className.length === 4){
            target.className = `${target.className} open show`;
        }
        else {
            target.className = "card";
        }
    }
    else {
        console.log("ignoring match");
    }
}

function checkMatch(){
    console.log("checking for match");
    let cardOne = clickedTargets.pop();
    let cardTwo = clickedTargets.pop();

    // Account for multiple clicks on the same card
    if (cardOne === cardTwo) {
        clickedTargets.pop();
        return;
     }

    if (cardOne.children[0].className ===
        cardTwo.children[0].className ) {
            const newClass = `${cardOne.className.slice(0,4)} match`;
            cardOne.className = newClass;
            cardTwo.className = newClass;
            matches++;
    }
    else {
        cardOne.className = cardOne.className.slice(0, 4);
        cardTwo.className = cardTwo.className.slice(0, 4);
    }

    if (matches === 8) {
        console.log("Congratulations You won!!");
    }
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
for(let i = 0; i < deck[0].children.length; i++) {
    let id = deck[0].children[i].id;
    let element = document.getElementById(id);

    element.addEventListener('click',
        function(){
            showCard(element);
            if(clickedTargets.length > 1) {
                checkMatch();
            }
        });
}
// Class names to use
// open show on click
// match on match