// app.js is the function of the webpage
console.log("yoyoyooy")

// Setting up the article title, link, and excerpt onto the DOM
// $.getJSON("/articles", function (data) {
//     $(".techClick").on("Click", function () {
//         for (var i = 0; i < data.length; i++) {
//             var title = "<h3>" + data[i].title + "</h3>";
//             var link = "<a href='>" + data[i].link + "'>" + data[i].link + "</a>"
//             var excerpt = "<p>" + data[i].excerpt + "</p>";
//             var saveButton = "<button type='button' class='btn btn-primary'>Save</button>";

//             // Grabs the article class from index.hmtl
//             $(".article").append("<div class='card'>" + title + link + excerpt + saveButton + "<br>");
//         }
//     })
// })

function techData() {
    $.ajax({ url: "/articles", method: "GET" })
        .then(function (data) {
            console.log(data)
        })
}
techData();

function moviesData() {
    $.ajax({ url: "/movies", method: "GET" })
        .then(function (data) {
            console.log(data)
        })
}
moviesData();