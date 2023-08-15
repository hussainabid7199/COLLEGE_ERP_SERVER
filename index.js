require('dotenv').config({ path: './.env' });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");


const app = express();
var allowlist = [process.env.BASE_URL,  process.env.BASE_PORT]
const corsOptions = {
    origin: `${allowlist} `, // specify the allowed origin(s)
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'], // specify the allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // specify the allowed headers
    credentials: true, // allow credentials (cookies, HTTP authentication) to be included
  };

app.use(cors(corsOptions));
app.use(cookieParser());

// const whitelist = [process.env.BASE_URL, 'http://developer2.com']
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error())
//     }
//   }
// }



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

