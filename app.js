//jshint esversion:6
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    passward: String
})
userSchema.plugin(encrypt, {secret:process.env.SECRET,encryptedFields: ['passward'] });
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

    const newUser = new User({
        email: req.body.username,
        passward: req.body.password
    })
    newUser.save((err)=>{
        if(err)
        console.log("err");
        else
        res.render("secrets")
    })
})

app.post("/login",(req, res) => {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email:userName},(err,data)=>{
        if(err)
        console.log(err);
        else{
            if(data)
            {
                if(data.password===password)
                {
                    res.render("secrets")
                }
                else{
                    res.send("wrong passward")
                }

            }
        }
    })
})










app.listen(3000, function () {
    console.log("server is running on 3000 port");
})
