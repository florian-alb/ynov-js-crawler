const slider = document.getElementById("myRange");
const output = document.getElementById("rangeValue");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
};
