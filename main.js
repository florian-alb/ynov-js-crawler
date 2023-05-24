const puppeteer = require('puppeteer');

const USERNAME = '31florian974@gmail.com';
const PASSWORD = process.env.LINKEDIN_PASSWORD;


// Navigate to LinkedIn login page and log
async function loginToLinkedin(page, login, password) {
    await page.goto('https://www.linkedin.com/checkpoint/rm/sign-in-another-account?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');
    await page.type('#username', login);
    await page.type('#password', password);
    await page.click('.login__form_action_container ');
    await page.waitForNavigation();
}

// Scroll down to the page in case of infinity scroll configuration
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

// get the employees
async function crawlCompanyEmployees(companyName) {
    // Launch a headless browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await loginToLinkedin(page, USERNAME, PASSWORD)

    //Go to company employee list
    await page.goto(`https://www.linkedin.com/company/${companyName}/people/`)

    // Scroll to the bottom of the page
    await page.setViewport({width: 1280, height: 800});
    await infiniteScroll(page);

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


    let employeeList = [];
    for (const link of employeesProfiles) {
        if (link !== null) {
            await page.goto(link);
            const employeeElements = await page.$$(".pv-top-card");
            let employee = {};
            for (const employeeElement of employeeElements) {
                const imgElement = await employeeElement.$('.pv-top-card-profile-picture__image');
                employee.profileImg = await page.evaluate((el) => el.src, imgElement);

                const subtitleElement = await employeeElement.$('.text-body-medium');
                employee.subtitle = await page.evaluate((el) => el.innerText, subtitleElement);

                const locationElement = await employeeElement.$(".text-body-small");
                employee.location = await page.evaluate((el) => el.innerText, locationElement);
            }
            await page.goto(`${link}/overlay/contact-info/`)

            const emailElement = await page.$('.ci-email');

            emailElement === null ? employee.email = "none" : await page.evaluate(el => el.innerText, emailElement);

            employeeList.push(employee);
        }
    }

    await browser.close();
    return employeeList;
}

// Usage example
const companyName = 'ntmgroup';

crawlCompanyEmployees(companyName)
    .then((employees) => {
        console.log(employees);
    })
    .catch((error) => {
        console.error('An error occurred:', error);
    });
