/*jshint esversion: 6 */

/* Array of all html object tiles(elements) in the periodic table*/
const elements = document.getElementsByClassName("element-tile");

/* Global Variable Array for 2.dimenseional list of elements, symbols, and corresponding number to be quizzed on*/
var elementTable = [];

/*Event Listner - After all DOM Content loaded, eventlisteners for buttons + toolbar intitated then new game alert box initiated*/
document.addEventListener("DOMContentLoaded",function () {

    
    let buttons = document.getElementsByTagName("button");
    for (let button of buttons) {
        button.addEventListener("click", afterClickButtons, true);
    }

    let toolbars = document.getElementsByClassName("toolbar-btn");
    for (let toolbar of toolbars) {
        toolbar.addEventListener("click", afterClickButtons, true);
    }

    alertBoxNewGame("Welcome");
    screenSizeListner(); // Call listener function at run time
});

/**
 * Called upon from event listener.
 * Extracts attribute data-type from clicked button, data-type used to execute button functionality.
 */

function afterClickButtons() {
    if (this.getAttribute("data-type") === "new-game") {
        alertBoxNewGame("New Game");
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
 * Iterates through constant table of html object for each element tile,
 * Adds event listener for clicks on each element tile.
 * Extracts element data from attributes of html object send to addToArray function 
 * After iteration complete Quiz is run.
 */
function initiateGame(playerName) {
    document.getElementById("name").innerText = playerName;
 
    let newLives = "5";
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

    shuffleArray();
    runQuiz();
}
/**
 * Called upon from event listener.
 * Extracts attribute from clicked tile, data sent to be checked for right answer.
 * Extracts which html element was clicked. Infor sent on so event listener can be removed.
 */
function afterClickElements (){
    let userAnswer = this.getAttribute("data-element-number");
    let clickedElement = this;
    checkClick(userAnswer, clickedElement);
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
 *  Add each Element name, number and symbol to an array, extracted from html object data type.
 */

function addToArray (name, num, symbol) {
    elementTable.push([name, num, symbol]);
}

/**
 * Quiz begins.
 * Iterates through all element tiles on periodic table and changes visible symbols to '?'
 * While also changing all background colour.
 */
function runQuiz () {
    let elementStyles = document.getElementsByClassName("text-symbol");
    for (let elementStyle of elementStyles) {
        elementStyle.setAttribute('data-element-symbol', "?");
        elementStyle.style.backgroundImage = 'linear-gradient(to bottom, rgba(242,246,248,1) 0%,rgba(216,225,231,1) 24%,rgba(181,198,208,1) 32%,rgba(224,239,249,1) 100%)';
        elementStyle.style.color = "black";
    }
    tableCheck();
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

/**
 * Check the object clicked matches the current element the user is asked to locate.
 */
function checkClick (userAnswer, clickedElement) {
    if (elementTable.length > 0) {
        let correctAnswer = elementTable[0][1];
        if  (userAnswer === correctAnswer) {
                incrementScore(); 
                revealElement(clickedElement);
                clickedElement.removeEventListener("click", afterClickElements, true);
            } else {
                decreaseLives();
            }
        }
}

/**
 * If the clicked object matches the current element, the clicked object is revealed
 */
function revealElement (clickedElement) {
    let eleSym = clickedElement.getAttribute("data-element-symbol");
    clickedElement.innerHTML = `<p class="text-symbol" data-element-symbol="${eleSym}"></p>`;
    clearAnswer();
}

/**
 * Removes top line in shuffled array of elements.
 */
function clearAnswer () {
    elementTable.splice(0, 1);
    removeElement();
}

/**
 * Removes the div containing the current element tile the checks table again
 */
function removeElement () {
    let currentElement = document.getElementsByClassName('new-ele-bdr');
    currentElement[0].parentNode.removeChild(currentElement[0]);
    tableCheck();
}

/**
 * Increases score text on DOM by +1
 */
function incrementScore () {
    let oldScore = parseInt(document.getElementById('score').innerText);
    document.getElementById("score").innerText = ++oldScore;
}

/**
 * Decreases lives text on DOM by -1
 */
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

/**
 * Starts new game. Checks elementTable legnth, if > 0 (contains previous games data) reset to empty and removed div containing current element tile.
 */
function newGame (playerName) {
    if (elementTable.length > 0) {
        elementTable = [];
        let currentElement = document.getElementsByClassName('new-ele-bdr');
        currentElement[0].parentNode.removeChild(currentElement[0]);
        initiateGame(playerName);
    } else {
        initiateGame(playerName);
    }
}

/**
 * Checks if user points >= 2. If so Add lives alert prompt. 
 * else error lives alert. 2 error alerts for 1 point and 0 points.
 */
function moreLives () {
    let currentLives = parseInt(document.getElementById('lives').innerText);
    let currentScore = parseInt(document.getElementById('score').innerText);

    if (currentScore > 1) {
        alertBox("Lives +1 ", "", "green");
        document.getElementById("score").innerText = currentScore - 2;
        document.getElementById("lives").innerText = ++currentLives;
    } else if (currentScore === 1) {
        alertBox("Error", `<br>
                            You are unable to buy more lives,<br> you have only ${currentScore} point to spend
                            <br>`, "red");
    }  else {
        alertBox("Error", `<br>
                            You are unable to buy more lives,<br> you have ${currentScore} points to spend
                            <br>`, "red");
    }
}

/**
 * Game over, remove event listners for extra life button and all element tiles on table.
 */
function gameOver () {
    
    for (let element of elements) {
        element.removeEventListener("click", afterClickElements, true);
    }

    let extraLifeButton = document.getElementsByClassName("btn--more-lives")[0];
    extraLifeButton.removeEventListener("click", afterClickButtons, true);

    let finalScore = parseInt(document.getElementById('score').innerText);
    alertBox("Game Over", `<br> you finished with ${finalScore} points`, "red");
}

/**
 * Creates a general alert box and underlay in new div at index [0] of DOM body
 */
function alertBox (alertTitle, alertMessage, colour) {
    
    let createBox = document.createElement('div');
    let styleSheet = document.styleSheets[0];
    let styleSheetEnd = styleSheet.cssRules.length;
    styleSheet.insertRule(`.alert-box > h1 {background-color:${colour}; width:100%; color:white; padding: 5px 0; border-radius: 5px; font-size: 1.5em; letter-spacing: 1px;}`, styleSheetEnd -5);
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

/**
 * Creates New game alert box containg text input field for user name and underlay in new div at index [0] of DOM body
 */
function alertBoxNewGame (alertTitle) {
    let createBox = document.createElement('div');
    let parent = document.getElementsByClassName("game-area")[0].parentNode;
    createBox.innerHTML = `<div class="alert-box">
                                <h1 style="background-color:green ; width:100%; color:white; padding: 5px 0; border-radius: 5px; font-size: 1.5em; letter-spacing: 1px;">${alertTitle}</h1>
                                <br><p style="text-align:center;">Can you reassemble the periodic table?</p>
                                <br><p style="text-align:center;">Enter your name and start a new game!</p>
                                <label for="user-name">Player Name:</label>
                                <input type="text" id="user-name" name="user-name">
                                <button type="button" data-type="close-alert" class="btn btn--close btn--new" >
                                    <span>Start</span>
                                </button>
                            </div>`;
    createBox.classList.add('underlay'); 
    parent.insertBefore(createBox, parent.childNodes[0]);

    document.getElementsByClassName('btn--close')[0].addEventListener("click", closeAlertNewGame);
    document.getElementById('user-name').onkeypress = function(event){
        let key = event.keyCode;
        return ((key >= 65 && key <= 90) || (key >= 95 && key <= 122) || key == 32);
    };

}

/**
 * Closes new game alert box
 */
function closeAlertNewGame() {
    let playerName = document.getElementById('user-name').value;
    let currentAlert = document.getElementsByClassName('underlay');

    if (playerName == "") {
        document.getElementsByTagName('label')[0].innerText = "No name entered";
    } else if (playerName.length > 8){
        document.getElementsByTagName('label')[0].innerText = "Name entered too long";
    } else {
        document.getElementsByClassName('btn--close')[0].removeEventListener("click", closeAlertNewGame);
        currentAlert[0].parentNode.removeChild(currentAlert[0]);
        newGame(playerName);
    }
}

/**
 * Closes general alert box
 */
function closeAlert() {
    document.getElementsByClassName('btn--close')[0].removeEventListener("click", closeAlert);
    let currentAlert = document.getElementsByClassName('underlay');
    currentAlert[0].parentNode.removeChild(currentAlert[0]);

    let styleSheet = document.styleSheets[0];
    let styleSheetEnd = styleSheet.cssRules.length - 6;
    styleSheet.deleteRule(styleSheetEnd);
}

/**
 * Inner html text of help alert that is passed through alertBox
 */
function openHelp() {
    let helpTitle = "Help";
    let helpText = `
    <h3>How to play:</h3>

    <p>Your task is to reveal all the elements in the periodic table and score as many points as possible.</p>
    <ul>
        <li>Click/Touch where you think that element belongs?</li><br>
        <li>If you are correct you will be rewarded 1 point!</li><br>
        <li>If you are incorrect you will lose a life.</li><br>
    </ul>
    <p>Can you remember where every element is on the periodic table?</p><br>
    <p>TIP: Extra Life costs 2 points!</p><br>
    If playing on mobile, use Fullscreen mode.<br>
    Good Luck!
    `;
    alertBox(helpTitle, helpText, "red");
}

/**
 * Inner html text of information alert that is passed through alertBox
 */
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

/**
 * Stores player name and final score from DOM. Passed through alertBox function.
 */
function youWin() {
    let playerName = document.getElementById("name").innerText;
    let finalScore = parseInt(document.getElementById('score').innerText);
        alertBox("Quiz Completed", `<img src="assets/images/well_done.svg" alt="well done celebration image">
                                    <h2>Congratulations ${playerName}!</h2><br>
                                    <span>You know your stuff!</span><br>
                                    </p>You reassembled the periodic table and finished with ${finalScore} points.</p>`, "green");
}

/**
 * Forces fullscreen
 */
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

/**
 * Closes fullscreen
 */
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

/**
 * Sets media query as screenSize. 
 * Adds listner to media query.
 * passes media query to rotateScreenAlert
 */
function screenSizeListner () {
    let screenSize = window.matchMedia("(max-width: 639px)");
    screenSize.addListener(rotateScreenAlert); // Attach listener function on state changes
    rotateScreenAlert(screenSize);
}

/**
 * Checks screen size. Generates alert if screen size matches media query passed to function as screenSize.
 * If screen size changes to not match, alert removed.
 */
function rotateScreenAlert(screenSize) {
    if (screenSize.matches) { // If media query matches
        let createBox = document.createElement('div');
        createBox.innerHTML = `<h1>This content does not fit</h1>
                            <img src="assets/images/orientation_rotation_screen_icon.svg" alt="Rotate Screen Orientation Image">
                            <h2>Please rotate your device landscape</h2>`;
        createBox.classList.add('overlay'); 
        let parent = document.getElementsByClassName("game-area")[0].parentNode;
        parent.insertBefore(createBox, parent.childNodes[0]);
    } else {
        let currentAlert = document.getElementsByClassName('overlay');
        if (currentAlert.length > 0) {
            currentAlert[0].remove();
        }
        return;
    }
}