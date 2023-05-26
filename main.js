import puppeteer from "puppeteer";
import {login} from "./login.js";
import {crawl} from "./crawl.js";

const SESSION_COOKIE = '';
async function run(companyName, maxResults = 10) {
    // Launch a browser instance
    const browser = await puppeteer.launch(
        {
            headless: false, // open a visual page
            ignoreHTTPSErrors: true,
        }
    );
    const page = await browser.newPage();
    await login.loginToLinkedin(page, SESSION_COOKIE);
    // let employeeLinks = await crawl.scrapeEmployeesLinks(page, companyName);
    // employeeLinks = employeeLinks.slice(0, maxResults);
    // const employeeList = await crawl.crawlCompanyEmployees(page, employeeLinks);

    const employeeList = crawl.scrapCompanies(page,'Ynov');

    await browser.close();

    return employeeList;
}

// TODO : cas d'erreur

run('ynovcampus', 10)
    .then((employees) => {
        console.log(employees);
    })
    .catch((error) => {
        console.error('An error occurred:', error);
    });
