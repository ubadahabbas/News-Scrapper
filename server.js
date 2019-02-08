// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");
// Initialize Express
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
// Database configuration
var databaseUrl = "scraper";
var collections = ["testData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/savedArticles", function(req, res) {
db.testData.find({},function(err,data){
    res.json(data)
})
  });

function something (){
    var results = [];
    axios.get("https://www.nhl.com/news").then(function(response) {
        var $ = cheerio.load(response.data);
        $("div .article-item__top").each(function(i, element) {
        var title = $(element).find("h1").text();
        // var link = $(element).parent().attr("href");
        console.log(title)
       titles.push({title:title});
        });

        $("div .article-item__preview").each(function(i, element) {
            var body = $(element).find("p").text();
            // var link = $(element).parent().attr("href");
            console.log(body)
           articles.push({body:body});
            });

        
        for( var i=0; i<titles.length; i++){
            results.push({
                title: titles[i].title,
                body: articles[i].body
            })
        }
   

        // for (var i=0 ; i<results.length; i++){
        //     db.testData.insert({title: results[i].title, body: results[i].body},function(err,data){
        //         console.log(data)
        //       newData.push(data)
        //     })
        //   }
        });

        console.log(results)
        return(results)
}


var  results= something()
var titles =[];
var articles =[]
var newData =[];
app.post("/deleteArticle",function(req,res){
    db.testData.remove({title: req.body.title},function(err,data){
        res.redirect("/savedArticles")
    })
})

app.get("/scrapeData", function(req,res){
res.json(results);
})

app.post("/saveArticle",function(req,res){
    console.log(req.body)
    db.testData.insert({title: req.body.title, body:req.body.body,note:""},function(err,data){
                console.log(data)
            })
    res.end()
})

app.post("/updateNote",function(req,res){
    db.testData.update({title: req.body.title}, {$set: {note: req.body.note}})
    res.end();
})
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
