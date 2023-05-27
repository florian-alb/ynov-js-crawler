document.getElementById('session_cookie_form').addEventListener("submit", function (e) {
    e.preventDefault();
    loginErrorMessage(false);
    localStorage.setItem('session_cookie', document.getElementById('cookie').value);

    const name = 'Ynov';
    const session = localStorage.getItem('session_cookie');

    fetch(`/crawlEnterprises?name=${encodeURIComponent(name)}&session=${encodeURIComponent(session)}`) // Pass the name and session as query parameters
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
});

const errorMessage = document.getElementById("login_error");
function loginErrorMessage(bool){
    if (bool){
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }
}