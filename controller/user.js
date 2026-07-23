const express = require("express");
const router = express.Router();
const User = require("../Modals/User.js");


module.exports.signupform=(req,res)=>{
    res.render("User/signup.ejs");

}

module.exports.signUpUser =async(req,res,next)=>{
    try{
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const result = await User.register(newUser, password);
        console.log(result);
        res.redirect("/listings");
        
    } catch(e) {
        console.log(e);
        res.redirect("/signup");
    }
}


module.exports.loginUserForm=(req,res)=>{
    res.render("User/login.ejs");
}

module.exports.autoLoginRedirection=(req,res)=>{
        res.redirect("/listings");
    }


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect("/listings");
    })
}