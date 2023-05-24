const puppeteer = require('puppeteer');

const USERNAME = 'nikzibi31@gmail.com';
const PASSWORD = '19911974';


async function infiniteScroll(page, maxScrollAttempts = 3) {
    let previousHeight = 0;
    let scrollAttempts = 0;
    while (scrollAttempts < maxScrollAttempts) {
        await page.evaluate(() => {
            window.scrollTo(0, document.documentElement.scrollHeight);
        });
        await page.waitForTimeout(1000);
        const newHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        if (newHeight === previousHeight) {
            break;
        }
        previousHeight = newHeight;
        scrollAttempts++;
    }
}

async function runCrawler() {
    const browser = await puppeteer.launch(
        {
            headless: false,
            ignoreHTTPSErrors: true,
        }
    );
    const page = await browser.newPage();
    let nextPageExists = true;

    await page.goto('https://www.linkedin.com/checkpoint/rm/sign-in-another-account?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');

    await page.type('#username', USERNAME);

    await page.type('#password', PASSWORD);

    await page.click('.login__form_action_container ');

    await page.waitForSelector('.share-box-feed-entry__closed-share-box');

    // serach inov
    const company = 'Ynov';

    let companyNames = [];

    await page.goto(`https://www.linkedin.com/search/results/companies/?keywords=${company}`);

    await infiniteScroll(page);

    await page.waitForSelector('.artdeco-pagination__indicator--number');

    const pageCount = await page.evaluate(() => {
        const pages = document.querySelectorAll('.artdeco-pagination__indicator--number');
        return parseInt(pages[pages.length - 1].textContent);
    });

    for (let i = 1; i <= pageCount; i++) {
        await page.goto(`https://www.linkedin.com/search/results/companies/?keywords=${company}&page=${i}`);

        await page.waitForSelector('.reusable-search__result-container');
        const c = await page.evaluate(() => {
            const companies = Array.from(document.querySelectorAll('.reusable-search__result-container'));
            return companies.map(company => company.querySelector('.entity-result__title-line').textContent.trim());
        });

        companyNames.push(c);
    }

    console.log('Companies with "Ynov" in their name:');
    console.log(companyNames);

    await browser.close();
}

runCrawler();


// const getPagesNumber = () => {
//     const pages = document.querySelectorAll('.artdeco-pagination__indicator');
//     return parseInt(pages[pages.length - 1].textContent);
// }
// getPagesNumber()