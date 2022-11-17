//jshint esversion:6
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

var bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    passward: String
})
const User = new mongoose.model("User", userSchema)
app.get("/", (req, res) => {
    res.render("home")
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})
app.post("/register", (req, res) => {


    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {

        const newUser = new User({
            email: req.body.username,
            passward: hash
        })
        newUser.save((err) => {
            if (err)
                console.log("err");
            else
                res.render("secrets")
        })
    });


})

app.post("/login", (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;
    
    User.findOne({ email: userName }, (err, data) => {
        if (err)
            console.log(err);
        else {
            if (data) {
                bcrypt.compare(password, data.password, function(err, result) {
                    // result == true
                if (result=== true) {
                    res.render("secrets")
                }
                else {
                    res.send("wrong passward")
                }
                });

            }
        }
    })
})










app.listen(3000, function () {
    console.log("server is running on 3000 port");
})
