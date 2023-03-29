const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRound = 12;

const Samituser = new mongoose.Schema({
    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    cpassword:{
        type: String,
        required:true
    },
    department:{
        type: String,
        required:false
    },
    designation:{
        type: String,
        required:false
    },
    typeOfUser:{
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    phone: String,
    country: String,
    active: Boolean,
    data:{
        type: Date,
        default: Date.now
    }

});












// Student 
Samituser.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    const hashPassword = await bcrypt.hash(this.password, saltRound);
    const hashCpassword = await bcrypt.hash(this.cpassword, saltRound)

    this.password = hashPassword;
    this.cpassword = hashCpassword;
    next();
});



Samituser.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}






// Collection Creation 

let User = module.exports = mongoose.models.SamitErp || mongoose.model("Samituser", Samituser);






