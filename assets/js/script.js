var elements = document.getElementsByClassName("element-tile");
console.log(elements);

var styleSheet = document.styleSheets[0];

document.addEventListener("DOMContentLoaded",function() {

    for (let element of elements) {
        element.addEventListener("click", function () {
            let elementName = this.getAttribute("element-name");
            let elementSymbol = this.getAttribute("element-symbol");
            let elementNumber = parseInt(this.getAttribute("element-number"));
            console.log(elementSymbol);
            console.log(elementNumber);
            if  (elementNumber < 119) {
                alert(`You Clicked: ${elementSymbol} - ${elementName}`);
                console.log();
            } else {
                alert(`Error! This element is not in the periodic table.`);
            }
        })
    }

    runQuiz();
})


function runQuiz () {

    let elementStyles = document.getElementsByClassName("text-symbol");
    console.log(elementStyles);

    for (let elementStyle of elementStyles) {
        elementStyle.innerHTML="?";
        elementStyle.style.backgroundColor = "grey";
    }

    createElement();

}

function createElement() {
    
    let createElement = document.createElement('div');
    createElement.innerHTML = '<h1 class="text-symbol new-element">H</h1>';
    createElement.classList.add('element-tile', 'new-ele-bdr'); 
    createElement.setAttribute('element-name', 'Hydrogen');
    document.getElementById("question-area").appendChild(createElement); 
    styleSheet.insertRule ('.new-ele-bdr::after {content: "" attr(element-name) "";font-size: 0.6em;font-weight: bold;color: #000000;position: relative;bottom: 0px;left: -3px;}', 41);
    console.log (styleSheet);

}