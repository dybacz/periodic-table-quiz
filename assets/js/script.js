/*jshint esversion: 6 */
/* Array of all html object tiles in the periodic table*/
const elements = document.getElementsByClassName("element-tile");

/* Global Variable Array for 2.dimenseional list of elements, symbols, and corresponding number to be quizzed on*/
var elementTable = [];

/*Event Listner - After all DOM Content loaded, eventlisteners for buttons intitated then game inititated*/
document.addEventListener("DOMContentLoaded",function () {

    let buttons = document.getElementsByTagName("button");
    for (let button of buttons) {
        button.addEventListener("click", afterClickButtons, true);
    }

    let toolbars = document.getElementsByClassName("toolbar-btn")
    for (let toolbar of toolbars) {
        toolbar.addEventListener("click", afterClickButtons, true);
    }
    initiateGame();
});

function afterClickButtons() {
    if (this.getAttribute("data-type") === "new-game") {
        newGame();
    } else if (this.getAttribute("data-type") === "more-lives"){
        moreLives();
    } else if (this.getAttribute("data-type") === "help"){
        openHelp();
    } else if (this.getAttribute("data-type") === "information"){
        openInformation();
    } else if (this.getAttribute("data-type") === "full-screen"){
        fullScreen();
    } else if (this.getAttribute("data-type") === "full-screen-on"){
        closeFullScreen();
    }
}

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
    
        element.addEventListener("click", afterClickElements, true);

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
function afterClickElements (){
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
        elementStyle.style.backgroundImage = 'linear-gradient(to bottom, rgba(242,246,248,1) 0%,rgba(216,225,231,1) 24%,rgba(181,198,208,1) 32%,rgba(224,239,249,1) 100%)';
        elementStyle.style.color = "black";
    }
    console.table(elementTable);
    tableCheck();
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
 * If not you win.
 */
function tableCheck() {
    if (elementTable.length > 0) {
        nextChemicalElementTile();
    } else {
        youWin();
    }
}

/**
 * Creates a new DIV and edits in the innerHTML to with the loaded element symbol. 
 * Add class to div and set Attributes to the element name loaded.
 * Append this Div to Question Area.
 */

function nextChemicalElementTile() {
        let newEleName = elementTable[0][0];
        let newEleSym = elementTable[0][2];
        let nextChemicalElementTile = document.createElement('div');
        nextChemicalElementTile.innerHTML = `<p class="new-element" data-element-symbol="${newEleSym}"></p>`;
        nextChemicalElementTile.classList.add('new-ele-bdr'); 
        nextChemicalElementTile.setAttribute('data-element-name', `${newEleName}`);
        document.getElementById("question-area").appendChild(nextChemicalElementTile); 
}



function checkClick (userAnswer, clickedElement) {
    if (elementTable.length > 0) {
        let correctAnswer = elementTable[0][1];
        if  (userAnswer === correctAnswer) {
                    incrementScore(); 
                    console.log(clickedElement);
                    revealElement(clickedElement);
                    clickedElement.removeEventListener("click", afterClickElements, true);
                } else {
                    decreaseLives();
                }
            }
    }

function revealElement (clickedElement) {
    let eleSym = clickedElement.getAttribute("data-element-symbol");
    clickedElement.innerHTML = `<p class="text-symbol" data-element-symbol="${eleSym}"></p>`;
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
    tableCheck();
}

function incrementScore () {
    let oldScore = parseInt(document.getElementById('score').innerText);
    document.getElementById("score").innerText = ++oldScore;
}

function decreaseLives () {
    let oldLives = parseInt(document.getElementById('lives').innerText);
    if (oldLives > 1) {
        document.getElementById("lives").innerText = --oldLives;
        alertBox("Wrong", `You clicked the incorrect element. - 1 Life`, "red");
    } else if (oldLives === 1) {
        document.getElementById("lives").innerText = --oldLives;
        gameOver();
    } else {
        gameOver();
    }
    }


function newGame () {
    if (elementTable.length > 0) {
        elementTable = [];
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
        alertBox("Lives +1 ", "", "green")
        document.getElementById("score").innerText = currentScore - 2;
        document.getElementById("lives").innerText = ++currentLives;
    } else if (currentScore === 1) {
        alertBox("Error", `You are unable to buy more lives, you have only ${currentScore} point to spend`, "red");
    }  else {
        alertBox("Error", `You are unable to buy more lives, you have ${currentScore} points to spend`, "red");
    }
}
function gameOver () {
    
    for (let element of elements) {
        element.removeEventListener("click", afterClickElements, true);
    }

    let extraLifeButton = document.getElementsByClassName("btn--more-lives")[0];
    extraLifeButton.removeEventListener("click", afterClickButtons, true);

    let finalScore = parseInt(document.getElementById('score').innerText);
    alertBox("Game Over", `<br> you finished with ${finalScore} points`, "red");
}

function alertBox (alertTitle, alertMessage, colour) {
    let createBox = document.createElement('div');
    let styleSheet = document.styleSheets[0];
    let styleSheetEnd = styleSheet.cssRules.length;
    styleSheet.insertRule(`.alert-box > h1 {background-color:${colour}; width:100%; color:white; padding: 5px 0; border-radius: 5px; font-size: 1.5em; letter-spacing: 1px;}`, styleSheetEnd - 3);
    createBox.innerHTML = `<div class="alert-box">
                                <h1>${alertTitle}</h1>
                                ${alertMessage}
                                <button type="button" data-type="close-alert" class="btn btn--close">
                                    <span>Close</span>
                                </button>
                            </div>`;
    createBox.classList.add('underlay'); 
    let parent = document.getElementsByClassName("game-area")[0].parentNode;
    parent.insertBefore(createBox, parent.childNodes[0]);
    document.getElementsByClassName('btn--close')[0].addEventListener("click", closeAlert);

}

function closeAlert() {
    let currentAlert = document.getElementsByClassName('underlay');
    currentAlert[0].parentNode.removeChild(currentAlert[0]);
    let styleSheet = document.styleSheets[0];
    let styleSheetEnd = styleSheet.cssRules.length - 4;
    styleSheet.deleteRule(styleSheetEnd);
    console.log(styleSheet);
}

function openHelp() {
    let helpTitle = "Help";
    let helpText = `
    <h3>How to play:</h3>

    <p>Your task is to reveal all the elements in the periodic table and score as many points as possible.</p>
    <ul>
        <li>Click/Touch where you think that element is?</li><br>
        <li>If correct you will be rewarded with 1 point!</li><br>
        <li>If incorrect you will lose a life</li><br>
    </ul>
    <p>Can you remember where every element is on the periodic table?</p><br>
    <p>TIP: Extra Life costs 2 points!</p><br>
    If playing on mobile, use Fullscreen mode.<br>
    Good Luck!
    `;
    alertBox(helpTitle, helpText, "red");
}

function openInformation() {
    let informationTitle = "About";
    let informationText = `<br>
    <p style="text-align:center; padding-bottom:10px;">
        Project 2 - Javascript Essentials - <a href="https://codeinstitute.net/" target="_blank">Code Institute</a>
    </p>
    <p style="text-align:center; padding-bottom:10px;">
        Created by James Dybacz &copy;2021
    </p>
    <p style="text-align:center; padding-bottom:10px;">
        <span>Email: <a href="mailto:jdybacz@gmail.com" target="_blank"><i class="fas fa-envelope"></i></a></span>
        <span>GitHub: <a href="https://github.com/dybacz" target="_blank"><i class="fab fa-github"></i></a></span>
        <span>LinkenIn:<a href="https://www.linkedin.com/in/james-dybacz/" target="_blank"><i class="fab fa-linkedin"></i></a></span>
    </p>
    <p style="text-align:center;">
        <a href="https://jigsaw.w3.org/css-validator/check/referer">
            <img style="border:0;width:88px;height:31px"
                src="https://jigsaw.w3.org/css-validator/images/vcss-blue"
                alt="Valid CSS!" />
        </a>
    </p>
    <br>`;
    alertBox(informationTitle, informationText, "grey");
}

function youWin() {
    let finalScore = parseInt(document.getElementById('score').innerText);
        alertBox("Quiz Completed", `<p>Congratulations! you completed the table with a score of ${finalScore}</p>`, "green");
}

function fullScreen() {
    let gameArea = document.documentElement;
    if (gameArea.requestFullscreen) {
        gameArea.requestFullscreen();
      } else if (gameArea.webkitRequestFullscreen) { /* Safari */
        gameArea.webkitRequestFullscreen();
      } else if (gameArea.msRequestFullscreen) { /* IE11 */
        gameArea.msRequestFullscreen();
      }
      let fullScreenBtn = document.getElementsByClassName("toolbar-btn")[0];
      fullScreenBtn.setAttribute('data-type', "full-screen-on");
}

function closeFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
    let fullScreenBtn = document.getElementsByClassName("toolbar-btn")[0];
      fullScreenBtn.setAttribute('data-type', "full-screen");
    }