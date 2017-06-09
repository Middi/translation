const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


var port = process.env.PORT || 3000;

// APP CONFIG
mongoose.connect("mongodb://localhost/translation");
app.set("view engine", "pug");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));


// MONGOOSE/MODEL CONFIG
var transSchema = new mongoose.Schema({
    polish: String,
    english: String,
    phonetic: String
}, {collection: 'polish'});

var Trans = mongoose.model("polish", transSchema);


app.get('/', function(req, res){
    Trans.find(function(err, data) {
    res.render('index', {data: data});
    });
});


// Start Server
app.listen(port, function () {
    console.log('server started on port 3000');
});