const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRound = 13;

// const studentSchema = new mongoose.Schema({
//     firstName:{
//         type: String,
//         required:true
//     },
//     lastName:{
//         type: String,
//         required:true
//     },
//     email:{
//         type: String,
//         required:true
//     },
//     password:{
//         type: String,
//         required:true
//     },
//     cpassword:{
//         type: String,
//         required:true
//     },
//     department:{
//         type: String,
//         required:true
//     },
//     phone: Number,
//     country: String,
//     active: Boolean,
//     data:{
//         type: Date,
//         default: Date.now
//     }

// });



const teacherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    phone: String,
    country: String,
    active: Boolean,
    data: {
        type: Date,
        default: Date.now
    }

});



// const adminSchema = new mongoose.Schema({
//     firstName:{
//         type: String,
//         required:true
//     },
//     lastName:{
//         type: String,
//         required:true
//     },
//     email:{
//         type: String,
//         required:true
//     },
//     password:{
//         type: String,
//         required:true
//     },
//     cpassword:{
//         type: String,
//         required:true
//     },
//     phone: Number,
//     country: String,
//     active: Boolean,
//     data:{
//         type: Date,
//         default: Date.now
//     }

// });





// Student 
// studentSchema.methods.generateAuthToken = async ()=>{
//     try{
//         let token =jwt.sign({_id: this._id}, process.env.SECRET_KEY);
//         this.token = this.tokens.concat({token: token});
//         await this.save();
//         return token;
//     }catch(e){
//         console.log(e);
//     }
// }

// studentSchema.pre("save", async function (next) {
//     if (!this.isModified('password')) return next();

//     const hashPassword = await bcrypt.hash(this.password, saltRound);
//     const hashCpassword = await bcrypt.hash(this.cpassword, saltRound)

//     this.password = hashPassword;
//     this.cpassword = hashCpassword;
//     next();
// });

// Teacher


teacherSchema.methods.generateAuthToken = async () => {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        console.log(this.token = this.tokens.concat({ token: token }))
        await this.save();
        return token;
    } catch (e) {
        console.log(e);
    }
}

teacherSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    const hashPassword = await bcrypt.hash(this.password, saltRound);
    const hashCpassword = await bcrypt.hash(this.cpassword, saltRound)

    this.password = hashPassword;
    this.cpassword = hashCpassword;
    next();
});


// Admin 


// adminSchema.methods.generateAuthToken = async ()=>{
//     try{
//         let token =jwt.sign({_id: this._id}, process.env.SECRET_KEY);
//         this.token = this.tokens.concat({token: token});
//         await this.save();
//         return token;
//     }catch(e){
//         console.log(e);
//     }
// }

// adminSchema.pre("save", async function (next) {
//     if (!this.isModified('password')) return next();

//     const hashPassword = await bcrypt.hash(this.password, saltRound);
//     const hashCpassword = await bcrypt.hash(this.cpassword, saltRound)

//     this.password = hashPassword;
//     this.cpassword = hashCpassword;
//     next();
// });


// Collection Creation 
let Users = module.exports = mongoose.model("Teacher", teacherSchema);




