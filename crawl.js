import {scrolling} from "./infiniteScroll.js";

class Crawl{
    // get the employees profiles.
    async scrapeEmployeesLinks(page, companyName) {
        //Go to company employee list
        await page.goto(`https://www.linkedin.com/company/${companyName}/people/`);

        // Scroll to the bottom of the page
        await page.setViewport({width: 1280, height: 800});
        await scrolling.infiniteScroll(page, 3);

        // Wait for the search results to load
        await page.waitForSelector(".scaffold-finite-scroll__content");

        // Extract employees profiles links
        return await page.evaluate(() => {
            const employeesProfiles = Array.from(document.querySelectorAll('.org-people-profile-card'));
            return employeesProfiles.map(profile => {
                let profileLink = profile.querySelector(".app-aware-link");
                if (profileLink !== null) {
                    return profileLink.href.split("?")[0];
                }
            })
        });
    }

    // Crawl all links and scrape employee information.
    async crawlCompanyEmployees(page, employeeLinks) {
        let employeeList = [];
        for (const link of employeeLinks) {
            if (link !== null) {
                // Set a random delay between 2000 and 5000 milliseconds to avoid multiples request error.
                const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
                await page.waitForTimeout(delay);

                await page.goto(link);

                await page.waitForSelector('.pv-top-card');
                const employeeElements = await page.$$(".pv-top-card");
                let employee = {link: link};
                for (const employeeElement of employeeElements) {
                    const imgElement = await employeeElement.$('.pv-top-card-profile-picture__image');
                    employee.profileImg = await page.evaluate((el) => el.src, imgElement);

                    const nameElement = await employeeElement.$('.text-heading-xlarge');
                    employee.name = await page.evaluate(el => el.innerText, nameElement);

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
        return employeeList;
    }

}

export const crawl = new Crawl();