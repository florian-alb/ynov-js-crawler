var slider = document.getElementById("myRange");
var output = document.getElementById("rangeValue");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
};
