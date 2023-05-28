document.getElementById('session_cookie_form').addEventListener("submit", function (e) {
    e.preventDefault();
    loginErrorMessage(false);

    const searchValue = document.getElementById('search-bar').value;
    const sessionValue = document.getElementById('cookie').value;

    fetch('/crawlCompanies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            search: searchValue,
            session: sessionValue
        })
    })
        .then(function (response) {
            if (response.status === 401) {
                loginErrorMessage('Failed to connect to Linkedin, wrong session Cookie.', true);
            } else {
                return response.json();
            }
        })
        .then(response => {
            if (response.message === 'Scraping completed successfully.') {
                fetch('/displayCompanies')
                    .then(response => response.json())
                    .then(response => displayCompany(response)
                    );
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

const companiesContainer = document.getElementById('companiesContainer');

const displayCompany = (rows) => {
    console.log(rows)

    rows.forEach((row) => {
        const {img, name, location, link} = row;
        const companyElement = document.createElement('div');
        const companyLink = document.createElement('a');
        companyLink.href = link; /// remplacer le link par le bon lien
        companyLink.appendChild(companyElement);
        companyElement.classList.add('company');
        companyElement.innerHTML = `
        <img src="${img}" alt="${name}" />
        <h3>${name}</h3>
        <p>Location: ${location}</p>
        <a href="${link}">More Info</a>
      `;

        companiesContainer.appendChild(companyElement);
    });
}