var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars")
var path = require("path");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 4000;

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
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Make public a static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://scrapingMongo:Yrap91411@ds211269.mlab.com:11269/heroku_4lkhh0x5";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// hey
// Routes
app.get("/scrapetech", function (req, res) {
    axios.get("https://www.technology.org/category/space/space-exploration/?gclid=CjwKCAiAj-_xBRBjEiwAmRbqYrqiO_Y45bK6L-DDrPyxjBYBrWWQFS6cDruWyqca8NIWAXjyIvsTdxoC6tQQAvD_BwE").then(function (response) {
        var $ = cheerio.load(response.data);

        $("div.technology-org-top-category-tag-content").each(function (i, element) {
            // save the article title and link to empty object
            var result = {};
            var data = { articleData: [] };

            result.title = $(element).children("a").text();
            result.link = $(element).children("a").attr("href");
            result.excerpt = $(element).children("div.technology-org-excerpt").text();

            data.articleData.push(result)

            db.Article.create(result)
                .then(function (dbArticle) {
                    // debugging to log result of title, link, & excerpt
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
            // inform user scrape completed
            // res.render("index", data)
            // console.log(data)
        });
    });
});

app.get("/scrapemovies", function (req, res) {
    axios.get("https://www.imdb.com/chart/top/?ref_=nv_mv_250").then(function (response) {
        var $ = cheerio.load(response.data);

        $("tr").each(function (i, element) {
            // save the article title and link to empty object
            var result = {};

            result.title = $(element)
                .children("td.titleColumn")
                .children('a')
                .text();

            result.link = $(element)
                .children("td.titleColumn")
                .children()
                .attr("href");

            result.excerpt = $(element)
                .children("td.titleColumn")
                .children('span')
                .text();

            result.image = $(element)
                .children("td.posterColumn")
                .children('a')
                .children('img')
                .attr('src');

            db.Movies.create(result)
                .then(function (dbMovies) {
                    // debugging to log result of title, link, & excerpt
                    // console.log(dbMovies);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        // inform user scrape completed
        res.json("Scrape Movies Site Completed")
    });
});

// Route for Home page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Route for getting all Articles from the db in mongo
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            // sends data to tech.handlebars page
            res.render("tech", { data: dbArticle })
            console.log(dbArticle)
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.get("/movies", function (req, res) {
    // Grab every document in the Articles collection
    db.Movies.find({})
        .then(function (dbMovies) {
            // If we were able to successfully find Articles, send them back to the client
            // res.json(dbMovies);
            res.render("movies", { data: dbMovies })
            // console.log(dbMovies)
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