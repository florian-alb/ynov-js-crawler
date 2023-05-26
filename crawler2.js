const puppeteer = require('puppeteer');

const USERNAME = '31florian974@gmail.com';
const PASSWORD = process.env.LINKEDIN_PASSWORD;


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

    const sessionCookie = '';
    const cookie = {'name': 'li_at', 'value': sessionCookie, 'domain': '.linkedin.com'};
    await page.setCookie(cookie);
    await page.goto('https://www.linkedin.com');
    await page.waitForSelector('.share-box-feed-entry__closed-share-box');
    await page.waitForTimeout(3000);

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
    console.log(companyNames.flat());

    await browser.close();
}

runCrawler();