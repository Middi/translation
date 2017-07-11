const express = require('express');
const path = require('path');
const app = express();
const expressSanitizer = require("express-sanitizer");
const mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require("passport-local-mongoose");
const bodyParser = require('body-parser');
var User = require("./models/user");


var port = process.env.PORT || 3000;

// APP CONFIG
mongoose.connect("mongodb://middi:youandme123@ds163701.mlab.com:63701/translation");
app.set("view engine", "pug");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Table Plate",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// =====================
// Check logged in
// =====================
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


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


app.get('/new', isLoggedIn, function(req, res){
    Trans.find( { category: "Directions" }, function(err, data) {
        res.render('new', {data: data});
    });
});

// CREATE ROUTE
app.post("/entry", function(req, res){
    // Create Entry
    Trans.create(req.body.trans, function(err, newEntry){
        if(err){
            res.render("/");
        }
        else {
            res.redirect("/new");
        }
    })
});


// LOGIN ROUTES
app.get("/login", function(req, res){
   res.render("login"); 
});


// Login Logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/new",
    failureRedirect: "/login"
}), function(req, res){
   
});


// Log Out Logic
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// Start Server
app.listen(port, function () {
    console.log('server started on port 3000');
});