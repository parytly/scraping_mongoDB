// app.js is the function of the webpage
console.log("yoyoyooy")

function techData() {
    $.ajax({ url: "/articles", method: "GET" })
        .then(function (data) {
            // console.log(data)
        })
}
techData();

function moviesData() {
    $.ajax({ url: "/movies", method: "GET" })
        .then(function (data) {
            // console.log(data)
        })
}
moviesData();


function getEachTitle() {
    var t = $(".title").text();
    // console.log(t)
    // console.log(t)
    for (var i = 0; i < t.length; i++) {
        var title = t[i];
        // console.log(t)
    }
    // var text = title.text($(this).text())
    // console.log(text)

    // Saves article when button clicks
    $(".saveArticle").click(function (e) {
        var articleId = $(this).attr("data-id");

        console.log(articleId)
        console.log("hello my friend")
    })
}
getEachTitle()






