const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require("../db/connection");
const Users = require("../model/schema");
const authenticate = require("../middleware/Authenticate")


router.get("/", (req, res) => {
    res.send("This is the request from the router server")
});

router.post("/register", async (req, res) => {
    const { firstName, lastName, department, email, phone, country, password, cpassword, designation } = req.body;

    // data_vilidation
    !firstName || !lastName || !department || !email || !phone || !country || !password || !cpassword ||!designation ? res.status(422).json({ error: "Please fill compleate data" }) : null
    // data_vilidation


    try {

        const userExist = await Users.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already register" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Password match unsuccessfull" })
        } else {
            const user = new Users({ firstName, lastName, department, email, phone, country, password, cpassword, designation });

            const userRegister = await user.save();

            userRegister ? res.status(200).json({ message: "User Register Successfully" }) : console.log("not a match");
        }


    } catch (err) {
        console.log(err);
    }


})


router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;
        if(!email || !password ){
            return res.status(400).json({ error: "Please fill the data" });
        }

        const userLogin = await Users.findOne({ email: email });
        console.log(userLogin);
        
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);
            let token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwttoken", token,{
                expires: new Date(Date.now() + 562342),
                httpOnly: true
            })

            console.log(isMatch);

            if(!isMatch){
               res.status(400).json({error: "Invalid Credentials"}); 
            }else{
                res.json({message: "Login Successfull"});
            }
        }else{
            res.status(400).json({error: "Invalid Credentialse Err!"});
        }

        

    } catch (err) {
            console.log(err);
    }
})


router.get("/dashboard", authenticate, (req, res)=>{
    res.send(req.rootUser);
    console.log("Response from server - Dashboard 200");
})

module.exports = router;