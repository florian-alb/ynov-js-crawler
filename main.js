const puppeteer = require('puppeteer');
const e = require("express");

// const USERNAME = '31florian974@gmail.com';
// const PASSWORD = process.env.LINKEDIN_PASSWORD;
const SESSION_COOKIE = 'AQEDATU1jN0F2maIAAABiFMGjEkAAAGIdxMQSVYAuTW1y6ntVe2cvrrzIYMioQR1_CKUBauY3lm2jmpwZKKBpEtGqq4NeOZ6I193z8m6FlzEluhVGorykp-oK8eOeztWZFIwPKgN21FiLPbUeKSrBEOl'

// Navigate to LinkedIn login page and log
async function loginToLinkedin(page, sessionCookie) {
    const cookie = {'name': 'li_at', 'value': sessionCookie, 'domain': '.linkedin.com'};
    await page.setCookie(cookie);
    await page.goto('https://www.linkedin.com');
    await page.waitForSelector('.share-box-feed-entry__closed-share-box');
}

// Scroll down to the page in case of infinity scroll configuration
async function infiniteScroll(page, maxScrolls = 10) {
    let previousHeight = await page.evaluate('document.body.scrollHeight');
    let currentHeight;
    let currentScoll = 0;
    do {
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForTimeout(2000);
        currentHeight = await page.evaluate('document.body.scrollHeight');
        currentScoll++;
    } while (currentHeight > previousHeight && (previousHeight = currentHeight) && currentScoll < maxScrolls);
}

// get the employees
async function crawlCompanyEmployees(companyName) {
    // Launch a headless browser instance
    const browser = await puppeteer.launch(
        {
            headless: false,
            ignoreHTTPSErrors: true,
        }
    );
    const page = await browser.newPage();

    await loginToLinkedin(page, SESSION_COOKIE)

    //Go to company employee list
    await page.goto(`https://www.linkedin.com/company/${companyName}/people/`)

    // Scroll to the bottom of the page
    await page.setViewport({width: 1280, height: 800});
    await infiniteScroll(page, 1);

    // Wait for the search results to load
    await page.waitForSelector(".scaffold-finite-scroll__content");

    // Extract employees profiles links
    const employeesProfiles = await page.evaluate(() => {
        const employeesProfiles = Array.from(document.querySelectorAll('.org-people-profile-card'));
        return employeesProfiles.map(profile => {
            let profileLink = profile.querySelector(".app-aware-link");
            if (profileLink !== null) {
                return profileLink.href.split("?")[0];
            }
        })
    });

    console.log(employeesProfiles);

    let employeeList = [];
    for (const link of employeesProfiles) {
        if (link !== null) {
            await page.goto(link);
            const employeeElements = await page.$$(".pv-top-card");
            let employee = {link: link};
            for (const employeeElement of employeeElements) {
                const imgElement = await employeeElement.$('.pv-top-card-profile-picture__image');
                employee.profileImg = await page.evaluate((el) => el.src, imgElement);

                const subtitleElement = await employeeElement.$('.text-body-medium');
                employee.subtitle = await page.evaluate((el) => el.innerText, subtitleElement);
            }

            employee.location = await page.evaluate(() => {
                const el = document.querySelector('.text-body-small.inline.t-black--light.break-words');
                return el === null ? null : el.textContent.trim();
            });

            employee.email = await page.evaluate(() => {
                const el = document.querySelector('.pv-contact-info__contact-link.link-without-visited-state.t-14');
                return el === null ? null : el.textContent.trim();
            });

            employeeList.push(employee);
            console.log(employee);
        }
    }

    await browser.close();
    return employeeList;
}

// Usage example
const companyName = 'ynovcampus';

crawlCompanyEmployees(companyName)
    .then((employees) => {
        console.log(employees);
    })
    .catch((error) => {
        console.error('An error occurred:', error);
    });
