import express from "express";
const app = express;


app.use(express.static('public'));
console.log("server is started on port :8080")
app.set('view engine', 'ejs');
app.listen(8080);

app.get('/', function (req, res) {
    res.render('pages/homepage');
});

app.get('/result', function (req, res) {
    res.render('pages/result');
});

