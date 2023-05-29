import {displayMessage} from "./displayMessage.js";

export const scrapEmployees = async (companyLink) => {
    const maxResults = document.getElementById('myRange').value

    const submitButton = document.querySelectorAll('.company-button');
    submitButton.forEach(button => button.disabled = true);

    displayMessage("Scrapping in progress, please wait...")

    await fetch('/crawlEmployees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            link: companyLink,
            max: maxResults,
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            displayMessage("Scrapping succeed, redirection...")
            console.log('Scrapping succeed, redirection...')
            window.location.href = "/result";
        })
        .catch(error => {
            console.log(error);
        });
}
