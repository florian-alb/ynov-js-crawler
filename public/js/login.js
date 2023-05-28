document.getElementById('session_cookie_form').addEventListener("submit", async function (event) {
    event.preventDefault();

    await removeResults();

    await displayMessage(false);

    const searchValue = document.getElementById('search-bar').value;
    const sessionValue = document.getElementById('cookie').value;

    await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session: sessionValue
        })
    })
        .then(function (response) {
            if (response.status === 401) {
                displayMessage('Failed to connect to Linkedin, wrong session Cookie.', true);
            } else {
                displayMessage('Login successful. \n Waiting for results.', true);
            }
        })
        .catch(error => {
            displayMessage('An error has occurred. Please try again later.', true);
            console.error(error);
        });

    await fetch('/crawlCompanies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            search: searchValue,
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                displayMessage("", false)
                fetch('/displayCompanies')
                    .then(response => response.json())
                    .then(data => {
                        displayCompanies(data.data);
                    })
                    .catch(err => console.error(err));
            } else {
                displayMessage("No company found", true);
            }
        }).catch(error => {
            console.log(error);
        })
});

const errorMessage = document.getElementById("login_error");

function displayMessage(message, bool) {
    if (bool) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }
}

const companiesContainer = document.getElementById('companiesContainer');

const displayCompanies = (companies) => {
    const companiesContainer = document.getElementById('companiesContainer');
    companies.forEach(company => {
        const companyDiv = document.createElement('div');
        companyDiv.className = "company_search_result"
        companyDiv.innerHTML = `
            <img src="${company.img}" alt="${company.name}">
            <h3>${company.name}</h3>
            <p>Location: ${company.location}</p>
            <a href="${company.link}">More Info</a>
        `;
        companiesContainer.appendChild(companyDiv);
    });
};

const removeResults = () => {
    let companies = document.querySelectorAll('.company_search_result');
    if (companies.length>0){
        companies.forEach(el => el.remove())
    }
}