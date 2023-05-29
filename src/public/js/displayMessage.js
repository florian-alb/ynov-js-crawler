const errorMessage = document.getElementById("login_error");

export function displayMessage(message, bool) {
    if (bool) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }
}