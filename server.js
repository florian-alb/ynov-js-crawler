var express = require('express');
const ejs = require('ejs');
var app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.listen(8080);

app.get('/', function (req, res) {
    res.render('pages/homepage');
});

app.get('/result', function (req, res) {
    res.render('pages/result');
});

app.get('/test', function (req,res){
    res.render('pages/testmodal')
})