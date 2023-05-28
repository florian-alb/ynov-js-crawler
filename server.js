import express from "express";
import {linkedinLogin} from "./src/linkedinLogin.js";
import puppeteer from "puppeteer";
import {crawl} from "./src/crawl.js";
import {database} from "./database/database.js";
import e from "express";

const app = express();
app.use(express.static('public'));

app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/homepage');
});


app.post('/crawlCompanies', async function (req, res) {
    const search = req.body.search;
    const sessionCookie = req.body.session;

    const browser = await puppeteer.launch(
        {
            headless: false, // open a visual page
            ignoreHTTPSErrors: true,
            timeout: 0,
        }
    );
    const page = await browser.newPage();
    const successfulLogin = await linkedinLogin.loginToLinkedin(page, sessionCookie);

    if (!successfulLogin) {
        console.log("erreur de login")
        res.status(401);
        res.send({
            status: 401,
            message: "Failed to login to linkedin"
        });
    } else {
        const companiesProfiles = await crawl.scrapCompanies(page, search);
        await browser.close();
        res.json({
            status: 200,
            message: 'Scraping completed successfully.',
            companies: companiesProfiles,

        })
    }
});

app.get('/displayCompanies', (req, res) => {
    database.runQuery(database.selectDataQueryEnterprises)
        .then((rows => res.json(rows)))
        .catch(e => res.json(e))
});


app.get('/result', function (req, res) {
    res.render('pages/result');
});


app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
});

