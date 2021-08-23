/* Array of all html object tiles in the periodic table*/
const elements = document.getElementsByClassName("element-tile");

/* Global Variable Array for 2.dimenseional list of elements, symbols, and corresponding number to be quizzed on*/
var elementTable = new Array();

/*Event Listner - After all DOM Content loaded, eventlisteners for buttons intitated then game inititated*/
document.addEventListener("DOMContentLoaded",function () {

    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function () {
            if (this.getAttribute("data-type") === "new-game") {
                newGame();
            } else if (this.getAttribute("data-type") === "more-lives"){
                moreLives();
            } else if (this.getAttribute("data-type") === "help"){
                openHelp();
            }
        })
    }
    initiateGame();
})

/** Initiates New Game
 * Sets Initial value for lives and points.
 * Iterates through Constant table of html object for each element tile,
 * Adds event listener for clicks on each element tile.
 * Extracts element data from attributes of html object send to addToArray function 
 * After iteration complete Quiz is run.
 */
function initiateGame() {
    
    let newLives = "3";
    document.getElementById("lives").innerText = newLives;

    let newScore = "0";
    document.getElementById("score").innerText = newScore;

    for (let element of elements) {
    
        element.addEventListener("click", afterClick, true);

        let eleName = element.getAttribute("data-element-name");
        let eleNum = element.getAttribute("data-element-number");
        let eleSym = element.getAttribute("data-element-symbol");
        addToArray(eleName, eleNum, eleSym);
    }

    /*shuffleArray();*/
    runQuiz();
}
/**
 * Extracts attribute from clicked tile, data sent to be checked for right answer.
 * Extracts which html element was clicked. Infor sent on so event listener can be removed.
 */
function afterClick (){
    let userAnswer = this.getAttribute("data-element-number");
    let clickedElement = this;
    checkClick(userAnswer, clickedElement);
}

/**
 *  Function to add each Element name, number and symbol to an array.
 */

function addToArray (name, num, symbol) {
    elementTable.push([name, num, symbol]);
}

/**
 * Quiz begins.
 * Iterates through all element tiles on periodic table and changes visible symbols to '?'
 * While also changing all background colours to grey.
 */
function runQuiz () {
    let elementStyles = document.getElementsByClassName("text-symbol");
    for (let elementStyle of elementStyles) {
        elementStyle.setAttribute('data-element-symbol', "?");
        elementStyle.style.backgroundColor = "grey";
    }
    console.table(elementTable);
    createElement();
}

/**
 * Shuffles List of elements to create a random order for questioning.
 * Shuffle uses Fisher-Yates Algorithm for random sorting.
 */
 function shuffleArray() {
    for (let i = elementTable.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let k = elementTable[i];
        elementTable[i] = elementTable[j];
        elementTable[j] = k;
      }
}

/**
 * Checks to make sure global table of shuffled elements has content. 
 * If so it Loads chemical element name and symbol from top of the shuffled global table.
 * Creates a new DIV and edits in the innerHTML to with the loaded element symbol. 
 * Add class to div and set Attributes to the element name loaded.
 * Append this Div to Question Area.
 * 
 * If no content in table. game done. Score extracted and sent to alert box along with message. 
 */

function createElement() {
    if (elementTable.length > 0) {
        let newEleName = elementTable[0][0];
        let newEleSym = elementTable[0][2];
        let createElement = document.createElement('div');
        createElement.innerHTML = `<h1 class="new-element" data-element-symbol="${newEleSym}"></h1>`;
        createElement.classList.add('new-ele-bdr'); 
        createElement.setAttribute('data-element-name', `${newEleName}`);
        document.getElementById("question-area").appendChild(createElement); 
    } else {
        let finalScore = parseInt(document.getElementById('score').innerText);
        alertBox(`Congratulations you completed the table with a score of ${finalScore}`, "yellow");
    }
}

function checkClick (userAnswer, clickedElement) {
    if (elementTable.length > 0) {
        let correctAnswer = elementTable[0][1];
        if  (userAnswer === correctAnswer) {
                    incrementScore(); 
                    console.log(clickedElement);
                    revealElement(clickedElement);
                    clickedElement.removeEventListener("click", afterClick, true);
                } else {
                    decreaseLives();
                }
            }
    }

function revealElement (clickedElement) {
    let eleSym = clickedElement.getAttribute("data-element-symbol");
    clickedElement.innerHTML = `<h1 class="text-symbol" data-element-symbol="${eleSym}"></h1>`;
    clearAnswer();
}

function clearAnswer () {
    elementTable.splice(0, 1);
    console.table(elementTable);
    removeElement();
}

function removeElement () {
    let currentElement = document.getElementsByClassName('new-ele-bdr');
    currentElement[0].parentNode.removeChild(currentElement[0]);
    createElement();
}

function incrementScore () {
    let oldScore = parseInt(document.getElementById('score').innerText);
    document.getElementById("score").innerText = ++oldScore;
}

function decreaseLives () {
    let oldLives = parseInt(document.getElementById('lives').innerText);
    if (oldLives > 1) {
        document.getElementById("lives").innerText = --oldLives;
        alertBox(`You clicked the incorrect element. - 1 Life`, "red");
    } else if (oldLives === 1) {
        document.getElementById("lives").innerText = --oldLives;
        gameOver();
    } else {
        gameOver();
    }
    }


function newGame () {
    if (elementTable.length > 0) {
        elementTable = new Array();
        let currentElement = document.getElementsByClassName('new-ele-bdr');
        currentElement[0].parentNode.removeChild(currentElement[0]);
        initiateGame();
    } else {
        initiateGame();
    }
}

function moreLives () {
    let currentLives = parseInt(document.getElementById('lives').innerText);
    let currentScore = parseInt(document.getElementById('score').innerText);

    if (currentScore > 1) {
        document.getElementById("score").innerText = currentScore - 2;
        document.getElementById("lives").innerText = ++currentLives;
    } else if (currentScore === 1) {
        alertBox(`You are unable to buy more lives, you have only ${currentScore} point to spend`, "red")
    }  else {
        alertBox(`You are unable to buy more lives, you have ${currentScore} points to spend`, "red")
    }
}
function gameOver () {
    
    for (let element of elements) {
        element.removeEventListener("click", afterClick, true);
    }
    let finalScore = parseInt(document.getElementById('score').innerText);
    alertBox(`Game Over <br> you finished with ${finalScore} points`, "red");
}

function alertBox (alertMessage, colour) {
    let createBox = document.createElement('div');
    let styleSheet = document.styleSheets[0];
    let styleSheetEnd = styleSheet.cssRules.length;
    styleSheet.insertRule(`.alert-box {border: 2px solid ${colour};}`, styleSheetEnd);
    createBox.innerHTML = `<div class="alert-box">
                                <p>${alertMessage}<p>
                                <button type="button" onclick="closeAlert()" class="btn btn--close">
                                    <p>Close</p>
                                </button>
                            </div>`;
    createBox.classList.add('underlay'); 
    let parent = document.getElementsByClassName("game-area")[0].parentNode;
    parent.insertBefore(createBox, parent.childNodes[0]);

}

function closeAlert() {
    let currentAlert = document.getElementsByClassName('underlay');
    currentAlert[0].parentNode.removeChild(currentAlert[0]);
    let styleSheet = document.styleSheets[0];
    let styleSheetEnd = styleSheet.cssRules.length - 1;
    styleSheet.deleteRule(styleSheetEnd);
    console.log(styleSheet);
}

function openHelp() {
    let helpText = `<h1>How to play:</h1><br>
    <ul>
        <li>Click/Touch where you think that element is?</li><br>
        <li>If correct you will be rewarded with 1 point!</li><br>
        <li>If incorrect you will lose a life</li><br>
    </ul>
    Can you memorise where every element goes? <br><br>
    HINT: You can buy extra lives for 2 points!<br><br>
    Good Luck!<br><br>`
    alertBox(helpText, "red");
}