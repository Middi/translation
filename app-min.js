const express=require("express"),path=require("path"),app=express();var expressSanitizer=require("express-sanitizer");const mongoose=require("mongoose"),bodyParser=require("body-parser");var port=process.env.PORT||3e3;mongoose.connect("mongodb://middi:youandme123@ds163701.mlab.com:63701/translation"),app.set("view engine","pug"),app.use(express.static("public")),app.use(bodyParser.urlencoded({extended:!0})),app.use(expressSanitizer()),app.use(express.static(path.join(__dirname,"public")));var transSchema=new mongoose.Schema({polish:String,english:String,phonetic:String,category:String,cat_id:Number},{collection:"polish"}),Trans=mongoose.model("polish",transSchema);app.get("/",function(e,n){Trans.find(function(e,r){n.render("index",{data:r})})}),app.get("/new",function(e,n){Trans.find({category:"Directions"},function(e,r){n.render("new",{data:r})})}),app.post("/entry",function(e,n){Trans.create(e.body.trans,function(e,r){e?n.render("/"):n.redirect("/new")})}),app.listen(port,function(){console.log("server started on port 3000")});