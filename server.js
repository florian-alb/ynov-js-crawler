import express from "express";
import {crawlEnterprises} from "./src/main.js";
import {linkedinLogin} from "./src/linkedinLogin.js";
import puppeteer from "puppeteer";
//import {loginErrorMessage} from "./public/js/login.js";

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/homepage');
});

app.get('/crawlEnterprises', async (req, res) => {
    const name = req.query.name;
    const sessionCookie = req.query.session;

    const browser = await puppeteer.launch(
        {
            headless: false, // open a visual page
            ignoreHTTPSErrors: true,
            timeout: 0,
        }
    );
    const page = await browser.newPage();

    const successfulLogin = await linkedinLogin.loginToLinkedin(page, sessionCookie);

    if (!successfulLogin){
        return;
        //loginErrorMessage(true);
    } else {
        console.log("tout va bien")
    }
    const companies = crawlEnterprises(name);
    console.log(companies);
});

app.get('/result', function (req, res) {
    res.render('pages/result');
});


app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
});
