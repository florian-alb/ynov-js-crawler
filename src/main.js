import puppeteer from "puppeteer";
import {linkedinLogin} from "./linkedinLogin.js";
import {crawl} from "./crawl.js";

async function crawlEmployees(companyName, sessionCookie, maxResults = 10) {
    // Launch a browser instance
    const browser = await puppeteer.launch(
        {
            headless: false, // open a visual page
            ignoreHTTPSErrors: true,
            timeout: 0,
        }
    );
    const page = await browser.newPage();
    await linkedinLogin.loginToLinkedin(page, sessionCookie);

    let employeeLinks = await crawl.scrapeEmployeesLinks(page, companyName);
    employeeLinks = employeeLinks.slice(0, maxResults);
    const employeeList = await crawl.crawlCompanyEmployees(page, employeeLinks);

    await browser.close();
    return employeeList;
}

// TODO : faire match le enterprise ID avec les employees
// TODO : connecter avec le front
