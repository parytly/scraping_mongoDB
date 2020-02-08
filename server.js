var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
// var exphbs = require("express-handlebars")

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 4000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// express handlebars
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// Make public a static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
app.get("/scrape", function (req, res) {
    axios.get("https://www.technology.org/category/space/space-exploration/?gclid=CjwKCAiAj-_xBRBjEiwAmRbqYrqiO_Y45bK6L-DDrPyxjBYBrWWQFS6cDruWyqca8NIWAXjyIvsTdxoC6tQQAvD_BwE").then(function (response) {
        var $ = cheerio.load(response.data);

        $("div.technology-org-top-category-tag-content").each(function (i, element) {
            // save the article title and link to empty object
            var result = {};

            result.title = $(element).children("a").text();
            result.link = $(element).children("a").attr("href");
            result.excerpt = $(element).children("div.technology-org-excerpt").text();

            // result.push({
            //     article_title: title,
            //     link: link,
            //     excerpt: excerpt
            // });
            // console.log(result)
            db.Article.create(result)
                .then(function (dbArticle) {
                    // debugging to log result of title and link
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        // inform user scrape completed
        res.send("Scrape Completed")
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});