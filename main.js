const puppeteer = require('puppeteer');

const USERNAME = 'user';
const PASSWORD = process.env.EMAIL_PASSWORD;

// get the company research of LinkedIn
async function getCompany(search){

}


// get the employees
async function crawlCompanyEmployees(companyName) {
    // Launch a headless browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to LinkedIn and log in (replace with your own login credentials)
    await page.goto('https://www.linkedin.com');
    await page.type('#username', 'your_username');
    await page.type('#password', 'your_password');
    await page.click('#login-submit');
    await page.waitForNavigation();

    // Search for the company
    await page.goto(`https://www.linkedin.com/search/results/companies/?keywords=${companyName}`)


    await page.goto(`https://www.linkedin.com/company/${companyName}/people/`);

    // Open the company profile page
    await page.waitForSelector('.search-result__result-link');
    const companyLink = await page.$('.search-result__result-link');
    const companyUrl = await page.evaluate((el) => el.href, companyLink);
    await page.goto(companyUrl);

    // Access the employee list
    await page.waitForSelector('a[data-control-name="topcard_employees"]');
    await page.click('a[data-control-name="topcard_employees"]');
    await page.waitForNavigation();

    // Extract employee data
    const employeeList = [];
    let nextPageExists = true;
    while (nextPageExists) {
        const employeeElements = await page.$$('.search-results__result-item');
        for (const employeeElement of employeeElements) {
            const nameElement = await employeeElement.$('.actor-name');
            const name = await page.evaluate((el) => el.innerText, nameElement);

            const jobTitleElement = await employeeElement.$('.actor-title');
            const jobTitle = await page.evaluate((el) => el.innerText, jobTitleElement);

            const locationElement = await employeeElement.$('.subline-level-2');
            const location = await page.evaluate((el) => el.innerText, locationElement);

            employeeList.push({ name, jobTitle, location });
        }

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
        }
    }

    // Close the browser
    await browser.close();

    return employeeList;
}

// Usage example
const companyName = 'Your Company Name';
crawlCompanyEmployees(companyName)
    .then((employees) => {
        console.log(employees);
    })
    .catch((error) => {
        console.error('An error occurred:', error);
    });
