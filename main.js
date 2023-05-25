import puppeteer from "puppeteer";
import {login} from "./login.js";
import {scrolling} from "./infiniteScroll.js";
import {crawl} from "./crawl.js";

const SESSION_COOKIE = 'AQEDATU1jN0F2maIAAABiFMGjEkAAAGIdxMQSVYAuTW1y6ntVe2cvrrzIYMioQR1_CKUBauY3lm2jmpwZKKBpEtGqq4NeOZ6I193z8m6FlzEluhVGorykp-oK8eOeztWZFIwPKgN21FiLPbUeKSrBEOl'

async function run(companyName, maxResults = 10) {
    // Launch a headless browser instance
    const browser = await puppeteer.launch(
        {
            headless: false,
            ignoreHTTPSErrors: true,
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

run('ynovcampus', 10)
    .then((employees) => {
        console.log(employees);
    })
    .catch((error) => {
        console.error('An error occurred:', error);
    });
