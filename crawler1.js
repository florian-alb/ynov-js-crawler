const puppeteer = require('puppeteer');

async function runCrawler() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let nextPageExists = true;

    await page.goto('https://www.linkedin.com/login/fr?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');
    console.log('1');
    // Login to LinkedIn (replace 'email' and 'password' with your own credentials)
    await page.type('#username', 'nikzibi31@gmail.com');
    console.log('2');
    await page.type('#password', '19911974');
    console.log('3');
    await page.click('.login__form_action_container ');
    console.log('4');

    // Wait for login success
    await page.waitForNavigation();
    console.log('5');

    // Search for "Ynov" enterprises
    await page.goto('https://www.linkedin.com/search/results/companies/?keywords=Ynov');
    console.log('6');

    while (nextPageExists) {
        // Wait for the search results to load
        await page.waitForSelector('.reusable-search__result-container');
        console.log('7');

        // Extract company names
        const companyNames = await page.evaluate(() => {
            const companies = Array.from(document.querySelectorAll('.reusable-search__result-container'));
            return companies.map(company => company.querySelector('.entity-result__title-line').textContent.trim());
        });
        console.log(10)

        // Check if there is a next page
        nextPageExists = await page.evaluate(() => {
            const nextButton = document.querySelector('.artdeco-pagination__button--next');
            if (nextButton && !nextButton.classList.contains('disabled')) {
                nextButton.click();
                return true;
            }
            return false;
        });

        if (nextPageExists) {
            await page.waitForNavigation();
            console.log(8)
        }
        console.log('Companies with "Ynov" in their name:');
        console.log(companyNames);
    }
    await browser.close();
}

runCrawler();
