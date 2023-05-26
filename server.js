import express from "express";
import open from "open";
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/homepage');
});

app.get('/result', function (req, res) {
    res.render('pages/result');
});

app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
    open('http://localhost:8080');
});
