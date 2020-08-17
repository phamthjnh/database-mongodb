const express = require("express")
const bodyParser = require("body-parser")
// const { ObjectID } = require("mongodb")
const MongoClient = require("mongodb").MongoClient
const app = express()

let db
MongoClient.connect("mongodb://localhost:27017", (err, client) => {
    if (err) {
        return console.log(err)
    }
    db = client.db("blog")
    console.log("Đã kết nối tới database")
})

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))
// Bài 1
// app.get("/blog", function (req, res) {
//     res.render("index.ejs", { result: post })
// })
// app.post("/new-post",function(req, res){
//     let newPost = req.body
//     post.push(newPost)
// }
//Bài 2
app.get("/blog", function (req, res) {
    db.collection("newblog").find().toArray().then(results => {
        console.log(results)
        res.render("index.ejs", { result: results })
    }).catch(error => {
        console.error(error)
    })
})
app.get('/blog/:blogID', function (req, res) {
    let id = req.params['blogID'];
    let objectId = require('mongodb').ObjectID
    db.collection("newblog").findOne({ _id: new objectId(id) }).then(results => {
        console.log(results)
        res.render("post.ejs", { post: results })
    }).catch(error => {
        console.error(error)
    })
});

app.post("/new-post", function (req, res) {
    db.collection("newblog").insertOne(req.body).then(results => {
        console.log(results)
        res.redirect("/blog")
    }).catch(error => {
        console.error(error)
    })
})

app.post("/update-blog", function (req, res) {
    console.log("Đã nhận request", req.body)
    let objectId = require('mongodb').ObjectID
    db.collection("newblog").findOneAndUpdate(
        { _id: new objectId(req.body.postID) },
        { $set: { date: req.body.postDate, title: req.body.postTitle, img: req.body.postImg, description: req.body.postDescription } },
        res.redirect("/blog")
    ).then(results => {
        console.log(results)
    }).catch(error => {
        console.error(error)
    })
})

app.post("/delete-blog", function (req, res) {
    console.log("Đã nhận request", req.body)
    let objectId = require('mongodb').ObjectID
    db.collection("newblog").deleteOne(
        { _id: new objectId(req.body.postID) },
        res.redirect("/blog")
    ).then(results => {
        console.log(results)
    }).catch(error => {
        console.error(error)
    })
})

app.listen(3000, function () {
    console.log("hello world running on port 3000")
})
// {img: req.body.img , date: req.body.date , title: req.body.title, description: req.body.description}