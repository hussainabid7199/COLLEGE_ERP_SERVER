const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");


const app = express();
app.use(cors());
app.use(cookieParser());


dotenv.config();
require("./db/connection");
// require("./server");
// const User = require("./model/schema")
require("./model/schema");
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());



// route
app.use(require("./router/auth"));



let port = process.env.PORT;



app.listen(port, (req, res) => {
    console.log(`Server is running on ${port}`);
})


// app.post("/login", async(req, res)=>{
//     try {
//         const email = req.body.email;
//         const userLogin = await User.findOne({ email: email });
//         if(userLogin){
//             console.log("Email Match successfull");
//         }

//     } catch(e){
//         console.log(e);
//     }
// })
