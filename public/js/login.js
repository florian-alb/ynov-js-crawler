document.getElementById('session_cookie_form').addEventListener("submit", function (e) {
    e.preventDefault();
    loginErrorMessage(false);

    const searchValue = document.getElementById('search-bar').value;
    const sessionValue = document.getElementById('cookie').value;

    fetch('/crawlEnterprises', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            search: searchValue,
            session: sessionValue
        })
    }).then(function (response) {
        if (response.status === 401) {
            loginErrorMessage('Failed to connect to Linkedin, wrong session Cookie.', true);
        } else {
            loginErrorMessage('Linkedin login successful...\nLoading results...')
        }
    })
        .catch(error => {
            loginErrorMessage('An error has occurred. Please try again later.', true);
            console.error(error);
        });
});

const errorMessage = document.getElementById("login_error");

function loginErrorMessage(error, bool) {
    if (bool) {
        errorMessage.textContent = error;
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }
}