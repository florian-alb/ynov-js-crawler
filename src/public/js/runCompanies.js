import {scrapEmployees} from "./runEmployees.js";
import {displayMessage} from "./displayMessage.js";

document.getElementById('session_cookie_form').addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = document.getElementById('submit_cookie');
    submitButton.disabled = true;

    await removeResults();

    await displayMessage(false);

    const searchValue = document.getElementById('search-bar').value;
    const sessionValue = document.getElementById('cookie').value;

    try {
        if(searchValue.length === 0){
            alert("The search must be non-null");
            submitButton.disabled = false;
            return;
        }

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
                    fetch('/displayCompanies', {method : 'GET'})
                        .then(response => response.json())
                        .then(data => {
                            displayCompanies(data.data);
                        })
                        .catch(err => console.error(err));
                } else {
                    displayMessage("No company found", true);
                }
            });
    } catch (error) {
        displayMessage('An error has occurred. Please try again later.', true);
        console.error(error);
    } finally {

        submitButton.disabled = false;
    }
});

const displayCompanies = (companies) => {
    const companiesContainer = document.getElementById('companiesContainer');
    companies.forEach(company => {
        const companyDiv = document.createElement('div');
        companyDiv.className = "company_search_result"
        companyDiv.innerHTML = `
        <div class='result-image'>
            <img src="${company.img}" alt="${company.name}">
        </div>
        <div class='result-informations'>
            <h3>${company.name}</h3>
            <p>Location: ${company.location}</p>
            <a href="${company.link}" target="_blank">More Info</a>
            </div>
        <div class='start-scarp-buton'>
            <button class="company-button">Scrap employees</button>
        </div>
        `;
        companyDiv.querySelector(".company-button").onclick = () => {
            scrapEmployees(company.link);
        };
        companiesContainer.appendChild(companyDiv);
    });
};

const removeResults = () => {
    let companies = document.querySelectorAll('.company_search_result');
    if (companies.length > 0) {
        companies.forEach(el => el.remove())
    }
}
