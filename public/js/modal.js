
    var inputText = document.getElementById("search-bar");
    var searchImage = document.getElementById("search-image");
    var modal = document.getElementById("modal");
    var closeButton = document.getElementsByClassName("close")[0];

    // Fonction pour ouvrir le modal
    function openModal() {
    modal.style.display = "block";
}

    function closeModal() {
    modal.style.display = "none";
}

    window.onclick = function(event) {
    if (event.target == modal) {
    closeModal();
}
}

    closeButton.onclick = function() {
    closeModal();
}

    searchImage.onclick = function() {
    openModal();
}

    inputText.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) { // 13 correspond à la touche Entrée
    openModal();
}});

