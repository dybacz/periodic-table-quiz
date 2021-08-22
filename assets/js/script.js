const elements = document.getElementsByClassName("element-tile");
console.log(elements);

var elementTable = new Array();

var styleSheet = document.styleSheets[0];


document.addEventListener("DOMContentLoaded",function () {
    for (let element of elements) {

        element.addEventListener("click", function () {
            let userAnswer = this.getAttribute("element-number");
            let clickedElement = this;
            console.log(clickedElement);
            checkClick(userAnswer, clickedElement);
        })

    }

    let buttons = document.getElementsByTagName("button")

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



    initiateQuiz();
})

function initiateQuiz() {
    
    let newLives = "10";
    document.getElementById("lives").innerText = newLives;

    let newScore = "0";
    document.getElementById("score").innerText = newScore;

    for (let element of elements) {
        let eleName = element.getAttribute("element-name");
        let eleNum = element.getAttribute("element-number");
        let eleSym = element.getAttribute("element-symbol");
        addToArray(eleName, eleNum, eleSym);
        
    }
    shuffleArray();
    runQuiz();
    
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
        elementStyle.innerHTML="?";
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

    if (elementTable.length > 0) {
    let newEleName = elementTable[0][0];
    let newEleSym = elementTable[0][2];
    let createElement = document.createElement('div');
    createElement.innerHTML = `<h1 class="text-symbol new-element">${newEleSym}</h1>`;
    createElement.classList.add('new-ele-bdr'); 
    createElement.setAttribute('element-name', `${newEleName}`);
    document.getElementById("question-area").appendChild(createElement); 
    styleSheet.insertRule ('.new-ele-bdr::after {content: "" attr(element-name)"";font-size: 0.7em;font-weight: 600;color: #000000;}', 41);
    console.log (styleSheet);
    } else {
        let finalScore = parseInt(document.getElementById('score').innerText);
        alert(`Congratulations you completed the table with a score of ${finalScore}`);
    }


}

function checkClick (userAnswer, clickedElement) {
    while (elementTable.length > 0) {
        let correctAnswer = elementTable[0][1];
        if  (userAnswer === correctAnswer) {
                    alert(`You Clicked the correct element`);
                    console.log();
                    revealElement(clickedElement);
                    incrementScore();           
                } else {
                    alert(`Error! You clicked the incorrect element`);
                    decreaseLives();
                }
            }
    }

function revealElement (clickedElement) {
    let eleSym = clickedElement.getAttribute("element-symbol");
    clickedElement.innerHTML = `<h1 class="text-symbol">${eleSym}</h1>`;
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
    } else if (oldLives === 1) {
        document.getElementById("lives").innerText = --oldLives;
        alert(`You have ran out of lives`);
        newGame();
    } else {
        gameOver();
    }
    }


function newGame () {
    if (elementTable.length > 0) {
        elementTable = new Array();
        let currentElement = document.getElementsByClassName('new-ele-bdr');
        currentElement[0].parentNode.removeChild(currentElement[0]);
        initiateQuiz();
    } else {
        initiateQuiz();
    }
}

function moreLives () {
    let currentLives = parseInt(document.getElementById('lives').innerText);
    let currentScore = parseInt(document.getElementById('score').innerText);

    if (currentScore > 1) {
        document.getElementById("score").innerText = currentScore - 2;
        document.getElementById("lives").innerText = ++currentLives;
    } else if (currentScore === 1) {
        alert(`You are unable to buy more lives, you have only ${currentScore} point to spend`)
    }  else {
        alert(`You are unable to buy more lives, you have ${currentScore} points to spend`)
    }
}

function gameOver () {
    alert(`GAME OVER You have ran out of lives! Proceed to New Game`);
    newGame();
}
