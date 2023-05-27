import puppeteer from "puppeteer";
import {login} from "./login.js";
import {crawl} from "./crawl.js";
import {scrolling} from "./infiniteScroll.js";

const SESSION_COOKIE = 'AQEDAUO7owUCML4kAAABiFgZxYMAAAGIfCZJg1YAyn89LWbUHpNssuOVIsQM7pId9WzDO8DtudOBNz8Fjtgdvd1KfkFXpd40_Sf5PxAAPYAWWGJWeuuqycsw9vvE5nQ4ZXkni3krSO-SplHCBfXYxXNk';

async function crawlEmployees(companyName, maxResults = 10) {
    // Launch a browser instance
    const browser = await puppeteer.launch(
        {
            headless: false, // open a visual page
            ignoreHTTPSErrors: true,
            timeout: 0,
        }
    );
    const page = await browser.newPage();
    await login.loginToLinkedin(page, SESSION_COOKIE);

    let employeeLinks = await crawl.scrapeEmployeesLinks(page, companyName);
    employeeLinks = employeeLinks.slice(0, maxResults);
    const employeeList = await crawl.crawlCompanyEmployees(page, employeeLinks);

    await browser.close();
    return employeeList;
}

async function crawlEnterprises(company) {
    // Launch a browser instance
    const browser = await puppeteer.launch(
        {
            headless: false, // open a visual page
            ignoreHTTPSErrors: true,
            timeout: 0,
        }
    );
    const page = await browser.newPage();
    await login.loginToLinkedin(page, SESSION_COOKIE);

    const companies = await crawl.scrapCompanies(page, company);
    await browser.close();
    return companies;
}

crawlEmployees('ntmgroup').then(r => console.log(r));


// TODO : aranger le code scrap;
// TODO : faire match le enterprise ID avec les employees
// TODO : connecter avec le front
