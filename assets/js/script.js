var elements = document.getElementsByClassName("element-tile");
console.log(elements);

var elementTable = new Array();

var styleSheet = document.styleSheets[0];


document.addEventListener("DOMContentLoaded",function() {

    

    for (let element of elements) {
        
        let eleName = element.getAttribute("element-name");
        let eleNum = element.getAttribute("element-number");
        let eleSym = element.getAttribute("element-symbol");
        addToArray(eleName, eleNum, eleSym);

        element.addEventListener("click", function () {

            console.log(eleSym);
            console.log(eleNum);
            if  (eleNum < 119) {
                alert(`You Clicked: ${eleSym} - ${eleName}`);
                console.log();
            } else {
                alert(`Error! This element is not in the periodic table.`);
            }
        })
    }

    runQuiz();
    
})

function addToArray (name, num, symbol) {
    elementTable.push([name, num, symbol]);

}




function runQuiz () {

    let elementStyles = document.getElementsByClassName("text-symbol");
    console.log(elementStyles);

    for (let elementStyle of elementStyles) {
        elementStyle.innerHTML="?";
        elementStyle.style.backgroundColor = "grey";
    }

    shuffleArray();

    console.log(elementTable);
    

    createElement();

}

function createElement() {
    
    let createElement = document.createElement('div');
    createElement.innerHTML = '<h1 class="text-symbol new-element">H</h1>';
    createElement.classList.add('new-element', 'new-ele-bdr'); 
    createElement.setAttribute('element-name', 'Hydrogen');
    document.getElementById("question-area").appendChild(createElement); 
    styleSheet.insertRule ('.new-ele-bdr::after {content: "" attr(element-name) "";font-size: 0.6em;font-weight: bold;color: #000000;position: relative;bottom: 10px;left: -3px;}', 41);
    console.log (styleSheet);

}

function shuffleArray() {
    for (let i = elementTable.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let k = elementTable[i];
        elementTable[i] = elementTable[j];
        elementTable[j] = k;
      }
}