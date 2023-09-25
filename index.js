require('dotenv').config({ path: './.env' });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");


const app = express();
app.use(cookieParser());


app.use(cors({
    "origin": [process.env.BASE_URL, process.env.BASE_PORT, process.env.STAGING_URL],
    "methods": ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    "preflightContinue": true,
    "optionsSuccessStatus": 204,
    "allowedHeaders": ['Content-Type','Authorization'],
    "credentials": true
}));


require("./db/connection");
require("./model/adminSchema");
require("./model/schema");
// for parsing application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to ADDAX SOLUTION Ltd.")
})

// route
app.use(require("./router/auth"));




let port = process.env.PORT;

app.listen(port, (req, res) => {
    console.log(`Server is running on ${port}`);
})

