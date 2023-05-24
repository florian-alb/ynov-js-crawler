const puppeteer = require('puppeteer');


async function runCrawler() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let nextPageExists = true;

    await page.goto('https://www.linkedin.com/login/fr?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');
    console.log('1');
    // Login to LinkedIn (replace 'email' and 'password' with your own credentials)
    await page.type('#username', 'gourbil.francis@gmail.com');
    console.log('2');
    await page.type('#password', '19911974');
    console.log('3');
    await page.click('.login__form_action_container ');
    console.log('4');

    // Wait for login success
    await page.waitForNavigation();
    console.log('5');

    // serach inov
    const company = 'Ynov';

    let companyNames = [];

    const pageCount = await page.$$('.artdeco-pagination__indicator--number');

    console.log(pageCount.length)

    // for (let i = 1; i <= pageCount; i++) {
    //     await page.goto(`https://www.linkedin.com/search/results/companies/?keywords=${company}&page=${i}`);
    //     // Wait for the search results to load
    //
    //     await page.waitForSelector('.reusable-search__result-container');
    //     const companiesElements = await page.$$(".reusable-search__result-container");
    //
    //     for (const companyElement of companiesElements) {
    //         const companyName = companyElement.$('entity-result__title-text');
    //         companyNames.push(page.evaluate((el) => el.innerText.trim(), companyName))
    //     }
    // }

    console.log('Companies with "Ynov" in their name:');
    console.log(companyNames);

    await browser.close();
}

runCrawler();