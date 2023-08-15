const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require("../db/connection");
const User = require("../model/schema");
const authenticate = require("../middleware/Authenticate");
const nodemailer = require("nodemailer");
const axios = require("axios");



router.get("/home", (req, res) => {
    res.send("This is the request from the router server")
});


router.post("/register", async (req, res) => {
    const { firstName, lastName, department, email, phone, country, password, cpassword, designation, typeOfUser } = req.body;

    // data_vilidation
    !firstName || !lastName || !department || !email || !phone || !country || !password || !cpassword || !designation || !typeOfUser ? res.status(422).json({ error: "Please fill compleate data" }) : null
    // data_vilidation


    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already register" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Password match unsuccessfull" })
        } else {
            bcrypt.hash(password, 12, async (error, password) => {
                try {
                    const user = new User({ firstName, lastName, department, email, phone, country, password: password, cpassword: password, designation, typeOfUser });
                    console.log(user);
                    const userRegister = await user.save();

                    userRegister ? res.status(200).json({ message: "Register Successfully" }) : console.log("Not a match");
                } catch (error) {
                    console.log(error);
                }
                console.log(error);
            });

        }


    } catch (e) {
        console.log(e);
    }


})


router.post("/login", async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill the data" });
        }

        const userLogin = await User.findOne({ email: email });


        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken();
            res.cookie("jwttoken", token, {
                expires: new Date(Date.now() + 5180),
                httpOnly: true
            })

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credentials" });
            } else {
                res.json({ message: "Login Successfull" });
            }
        } else {
            res.status(400).json({ error: "Invalid Credentialse" });
        }


    } catch (e) {
        console.log(e);
    }
})


router.get("/dashboard", authenticate, async (req, res) => {
    try {
        if (authenticate) {
            res.send(await
                req.rootUser
            );
        }
    } catch (e) {
        console.log(e);
    }


    console.log("Response from server - Dashboard 200");
})

router.get("/admin/student", async (req, res) => {
    try {
        const student = await User.find({ typeOfUser: "student" });
        return res.json(student);
    } catch (e) {
        return res.json({ code: 401, error: e.massage })
    }
})

router.get("/admin/teacher", async (req, res) => {
    try {
        const teacher = await User.find({ typeOfUser: "teacher" });
        return res.json(teacher)
    } catch (e) {
        return res.json({ code: 401, error: e.massage })
    }
})


router.post("/resetpassword", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send("Enter your email")
        }

        const forgotPassword = await User.findOne({ email: email });
        if (forgotPassword === null) {
            return res.json({ code: 404, message: "!Invalid User", response: "User don't exist!" })
        } else {

            // Sending email
            const transporter = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_EMAIL_PASSWORD
                }
            });

            const options = {
                from: process.env.USER_EMAIL,
                to: forgotPassword.email,
                subject: "Welcome to ADDEX SOLUTION Ltd.",
                text: "We are happy to welcome you to our portal."
            }

            transporter.sendMail(options, (error, info) => {
                if (error) {
                    console.log(error);
                    return;
                }
                const emailResponse = ("Sent :" + info.response);
                return res.json({ code: 200, message: "Reset link is sent on your register email!", response: emailResponse });
            })

            // Sending email


        }
    } catch (e) {
        return res.json({ code: 401, error: e })
    }
})


module.exports = router;