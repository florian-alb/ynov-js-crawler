import express from "express";
import {linkedinLogin} from "./src/linkedinLogin.js";
import puppeteer from "puppeteer";
import {crawl} from "./src/crawl.js";
import {database} from "./database/database.js";

const app = express();
let page;

app.use(express.static('public'));

app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/homepage');
});

app.post('/login', async function (req, res) {
    const sessionCookie = req.body.session;

    const browser = await puppeteer.launch(
        {
            headless: false, // open a visual page
            ignoreHTTPSErrors: true,
            timeout: 0,
        }
    );
    page = await browser.newPage();

    const successfulLogin = await linkedinLogin.loginToLinkedin(page, sessionCookie);
    if (!successfulLogin) {
        console.log("erreur de login");
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
        const companies = await database.getCompaniesFromDb();

        console.log("compani= ", companies);

        res.json({
            "message": "success",
            "data": companies
        });
    } catch (error) {
        res.status(400).json({"error": error});
    }
})



app.get('/result', function (req, res) {
    res.render('pages/result');
});


app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
});

