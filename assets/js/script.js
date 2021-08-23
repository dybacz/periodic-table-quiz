const elements = document.getElementsByClassName("element-tile");

var elementTable = new Array();


document.addEventListener("DOMContentLoaded",function () {

    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function () {
            if (this.getAttribute("data-type") === "new-game") {
                newGame();
            } else if (this.getAttribute("data-type") === "more-lives"){
                moreLives();
            } else {
                let gameType = this.getAttribute("help");
            }
        })
    }

    initiateGame();
})

function initiateGame() {
    
    let newLives = "3";
    document.getElementById("lives").innerText = newLives;

    let newScore = "0";
    document.getElementById("score").innerText = newScore;

    for (let element of elements) {
        element.addEventListener("click", addEvent, true);
        let eleName = element.getAttribute("data-element-name");
        let eleNum = element.getAttribute("data-element-number");
        let eleSym = element.getAttribute("data-element-symbol");
        addToArray(eleName, eleNum, eleSym);

        
    }

    /*shuffleArray();*/
    runQuiz();
}

function addEvent (){
    let userAnswer = this.getAttribute("data-element-number");
    let clickedElement = this;
    console.log(clickedElement);
    checkClick(userAnswer, clickedElement);
}
/**
 *  Function to add each Element name, number and symbol to an array.
 */

function addToArray (name, num, symbol) {
    elementTable.push([name, num, symbol]);
}

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

function createElement() {
    let styleSheet = document.styleSheets[0];
    let styleSheetEnd = styleSheet.length
    
    if (elementTable.length > 0) {

    let newEleName = elementTable[0][0];
    let newEleSym = elementTable[0][2];
    let createElement = document.createElement('div');
    createElement.innerHTML = `<h1 class="new-element" data-element-symbol="${newEleSym}"></h1>`;
    createElement.classList.add('new-ele-bdr'); 
    createElement.setAttribute('data-element-name', `${newEleName}`);
    document.getElementById("question-area").appendChild(createElement); 
    styleSheet.insertRule ('.new-ele-bdr::after {content: "" attr(data-element-name)"";font-size: 0.8em;font-weight: 600;color: #000000;}', styleSheetEnd + 1);
    console.log(styleSheet);
    } else {
        let finalScore = parseInt(document.getElementById('score').innerText);
        alertBox(`Congratulations you completed the table with a score of ${finalScore}`);
    }
}

function checkClick (userAnswer, clickedElement) {
    if (elementTable.length > 0) {
        let correctAnswer = elementTable[0][1];
        if  (userAnswer === correctAnswer) {
                    incrementScore(); 
                    console.log(clickedElement);
                    revealElement(clickedElement);
                    clickedElement.removeEventListener("click", addEvent, true);
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
        alertBox(`You clicked the incorrect element. - 1 Life`);
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
        alertBox(`You are unable to buy more lives, you have only ${currentScore} point to spend`)
    }  else {
        alertBox(`You are unable to buy more lives, you have ${currentScore} points to spend`)
    }
}
function gameOver () {
    
    for (let element of elements) {
        element.removeEventListener("click", addEvent, true);
    }
    let finalScore = parseInt(document.getElementById('score').innerText);
    alertBox(`Game Over <br> you finished with ${finalScore} points`);
}

function alertBox (alertMessage) {
    let createBox = document.createElement('div');
    createBox.innerHTML = `<div class="alert-box">
                                <p>${alertMessage}<p>
                                <button type="button" onclick="closeAlert()" class="btn btn--close">
                                    <p>Close</p>
                                </button>
                            </div>`;
    createBox.classList.add('underlay'); 
    let parent = document.getElementsByClassName("game-area")[0].parentNode;
    parent.insertBefore(createBox, parent.childNodes[0]);
    console.log(parent);

}

function closeAlert() {
    let currentAlert = document.getElementsByClassName('underlay');
    currentAlert[0].parentNode.removeChild(currentAlert[0]);
}