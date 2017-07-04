const express = require('express');
const path = require('path');
const app = express();
var expressSanitizer = require("express-sanitizer");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


var port = process.env.PORT || 3000;

// APP CONFIG
mongoose.connect("mongodb://middi:youandme123@ds163701.mlab.com:63701/translation");
app.set("view engine", "pug");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


// MONGOOSE/MODEL CONFIG
var transSchema = new mongoose.Schema({
    polish: String,
    english: String,
    phonetic: String,
    category: String,
    cat_id: Number
}, {collection: 'polish'});

var Trans = mongoose.model("polish", transSchema);


app.get('/', function(req, res){
    Trans.find(function(err, data) {
        res.render('index', {data: data});
    });
});


app.get('/new', function(req, res){
    Trans.find( { category: "Directions" }, function(err, data) {
        res.render('new', {data: data});
    });
});

// CREATE ROUTE
app.post("/entry", function(req, res){
    // Create Entry
    Trans.create(req.body.trans, function(err, newEntry){
        if(err){
            res.render("new");
        }
        else {
            res.redirect("/");
        }
    })
});

// Start Server
app.listen(port, function () {
    console.log('server started on port 3000');
});