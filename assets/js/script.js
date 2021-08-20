document.addEventListener("DOMContentLoaded",function() {
    let elements = document.getElementsByClassName("element-tile");
    console.log(elements);

    for (let element of elements) {
        element.addEventListener("click", function () {
            let elementName = this.getAttribute("element-name");
            let elementSymbol = this.getAttribute("element-symbol");
            console.log(elementSymbol);
            if (this.getAttribute("element-number") === "1") {
                alert(`You Clicked: ${elementSymbol} - ${elementName}`);
            } else {
                alert(`You Clicked: ${elementSymbol} - ${elementName}`);
            }
        })
    }
})