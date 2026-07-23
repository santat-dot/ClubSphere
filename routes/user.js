const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utility/wrapAsync.js");
const User = require("../Modals/User.js");
const userRouterController=require("../controller/user.js");


// app.get("/getdemo",async(req,res)=>{
    
//     let fakeUser= new User({
//         email:"san@gmail.com",
//         username:"jgawrufh",
//     }) 
    
//     let newUser = await User.register(fakeUser,"hello-world");
//     res.render("User/signup");




// })


router.route("/signup")
.get(userRouterController.signupform)
.post(wrapAsync(userRouterController.signUpUser));



router.route("/login")
.get(userRouterController.loginUserForm)
.post(
    passport.authenticate("local", {
        failureRedirect: "/login",
        // failureFlash:true,
    }),
    userRouterController.autoLoginRedirection
)


router.get("/logout",userRouterController.logout);



module.exports=router