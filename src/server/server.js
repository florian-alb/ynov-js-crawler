import express from "express";
import {linkedinLogin} from "./linkedinLogin.js";
import puppeteer from "puppeteer";
import {crawl} from "./crawl.js";
import {database} from "../database/database.js";
import sqlite3 from "sqlite3";

const app = express();
let page;
let browser;

app.use(express.static('src/public'));

app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/homepage');
});

app.post('/login', async function (req, res) {
    const sessionCookie = req.body.session;

    browser = await puppeteer.launch(
        {
            //headless: false, // open a visual page
            headless: true, // do not open a visual page
            ignoreHTTPSErrors: true,
            timeout: 0,
        }
    );
    page = await browser.newPage();

    const successfulLogin = await linkedinLogin.loginToLinkedin(page, sessionCookie);
    if (!successfulLogin) {
        console.log("erreur de login");
        await browser.close();
        res.status(401);
        res.send({
            status: 401,
            message: "Failed to login to linkedin"
        });
    } else {
        console.log("login successful");
        res.status(200);
        res.send({
            status: 200,
            message: "successfully logged to Linkedin",
        })
    }
})

app.post('/crawlCompanies', async function (req, res) {
    const search = req.body.search;

    try {
        const companiesProfiles = await crawl.scrapCompanies(page, search);
        res.json({
            status: 200,
            message: 'Scraping completed successfully',
            companies: companiesProfiles,
        })
    } catch (e) {
        console.log(e);
        if (e.message === 'No result found') {
            res.status(404).json({
                status: 404,
                message: 'No result found'
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
            });
        }
    }
});

app.get('/displayCompanies', async (req, res) => {
    try {
        const companies = await database.getFromDb(database.selectDataQueryCompanies);

        res.json({
            "message": "success",
            "data": companies
        });
    } catch (error) {
        res.status(400).json({"error": error});
    }
})

app.post('/crawlEmployees', async function (req, res) {
    console.log('Start crawling');
    const companyLink = req.body.link;
    const maxResults = req.body.max;

    try {
        const employees = await crawl.crawlEmployees(page, companyLink, maxResults)
        console.log('Scrapping done');
        res.redirect('/result');
    } catch (e) {
        console.log(e);
        if (e.message === 'No result found') {
            res.status(404).json({
                status: 404,
                message: 'No result found'
            });
        } else {
            res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
            });
        }
    } finally {
        await browser.close();
    }
})

app.get('/result', async (req, res) => {
    res.render('pages/result');
})

app.get('/displayResult', async (req, res) => {
    try {
        const employees = await database.getFromDb(database.selectDataQueryEmployees);
        res.json({
            "status": 200,
            "message": "success",
            "data": employees
        });
    } catch (error) {
        res.status(400).json({"error": error});
    }
})

app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
});

