const express = require("express")
const bodyParser = require('body-parser')
const path = require("path")
const attendenceRoute = require('./routes/attendance_r')
const dbconnc = require("./utils/database")

const session = require('express-session');
const flash = require('connect-flash');

const app = express()


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,"public")))
app.use('/',attendenceRoute)
app.use(express.json())


app.use(session({
    secret:'attendance',
    saveUninitialized: true,
    resave: true
}));
  
app.use(flash());

app.set("layouts","./layouts/main_layouts.ejs")
app.set("view engine", "ejs")


dbconnc();
app.listen(4000,()=>{
    console.log("Server running on 4000");
})