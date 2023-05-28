import {scrolling} from "./infiniteScroll.js";
import {database} from "../database/database.js";


class Crawl {
    // get the employees profiles.
    async scrapeEmployeesLinks(page, companyName) {
        //Go to company employee list
        await page.goto(`https://www.linkedin.com/company/${companyName}/people/`);

        // Scroll to the bottom of the page
        await page.setViewport({width: 1280, height: 800});
        await scrolling.infiniteScroll(page, 3);

        try {
            // Wait for the search results to load ( if they exist )
            await page.waitForSelector(".scaffold-finite-scroll__content", {timeout: 3000});

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
        } catch (e) {
            return [];
        }
    }

    // Crawl all links and scrape employee information.
    async crawlCompanyEmployees(page, employeeLinks) {
        await database.createDbConnection();
        let employeeList = [];
        for (const link of employeeLinks) {
            if (link !== null) {
                // Set a random delay between 2000 and 5000 milliseconds to avoid multiples request error.
                const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
                await page.waitForTimeout(delay);
                await page.goto(link);
                await page.waitForSelector('.pv-top-card');
                const employeeElements = await page.$$(".pv-top-card");
                let employee = {};
                employee.link = link;
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

                database.runQuery(database.insertDataQueryEmployee, Object.values(employee))
                    .then(result => {
                        console.log('Query executed successfully:', result);
                    })
                    .catch(error => {
                        console.error('Error executing query:', error);
                    });

            }
        }
        //database.closeDatabase();
        return employeeList;
    }

    async scrapCompanies(page, company) {
        await database.createDbConnection()

        await page.goto(`https://www.linkedin.com/search/results/companies/?keywords=${company}`);
        await scrolling.infiniteScroll(page);
        try {
            await page.waitForSelector('.reusable-search__entity-result-list', {timeout: 4000});
        } catch (e) {
            console.log(e);
            throw new Error("No result found");
        }

        const pageCount = await page.evaluate(() => {
            const pages = document.querySelectorAll('.artdeco-pagination__indicator--number');

            return pages[pages.length-1] === undefined ? 1 : parseInt(pages[pages.length - 1].textContent);
        });
        let companiesProfiles = [];
        for (let i = 1; i <= pageCount; i++) {
            await page.goto(`https://www.linkedin.com/search/results/companies/?keywords=${company}&page=${i}`);
            await page.waitForSelector('.reusable-search__result-container');
            const companiesElements = await page.$$('.entity-result__item');
            for (const companyElement of companiesElements) {
                let company = {};
                const imgElement = await companyElement.$('.EntityPhoto-square-3');
                company.profileImg = await page.evaluate((el) => {
                    return el === null ? null : el.src;
                }, imgElement);
                const nameElement = await companyElement.$('.entity-result__title-text')
                company.name = await page.evaluate(el => el.innerText, nameElement);
                const linkElement = await companyElement.$('.app-aware-link ')
                company.link = await page.evaluate((el) => el.href, linkElement);
                const locationElement = await companyElement.$('.entity-result__primary-subtitle');
                company.location = await page.evaluate((el) => el.innerText, locationElement);
                companiesProfiles.push(company)

                database.insertIntoDb(database.insertDataQueryCompany, Object.values(company))
                    .then(result => {
                        console.log('Query executed successfully:', result);
                    })
                    .catch(error => {
                        console.error('Error executing query:', error);
                    });

                //console.log(company)
            }
        }
        //database.closeDatabase();
        return companiesProfiles.flat();
    }

}

export const crawl = new Crawl();

