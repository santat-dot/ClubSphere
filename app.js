if(process.env.NODE_ENV!="production"){
    const dotEnv=require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const dburl=process.env.AtlasUrl;
const methodOverride = require("method-override");
const path = require("path");
const ejsMate=require("ejs-mate");
let ExpressError=require("./utility/ExpressError.js");
const Review = require("./Modals/review.js");
let session = require("express-session");
const MongoStore = require('connect-mongo');
const listingRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose =require("passport-local-mongoose")
const User=require("./Modals/User.js");



const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));





async function main() {
    await mongoose.connect(dburl);
}




main().then((res) =>{
    console.log("Database Connected Successfully");
}).catch((err)=>{
    console.log(err);
})

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.Secret,
    },
    touchAfter:24*3600,
})


let sessionOptions = {
    store,
    secret: "mysecrete",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
})



app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});



// app.get("/testListing",(req,res)=>{
//     let club = new list({
//     title: "IEEE Student Branch",
//     description:
//       "Enhance your technical knowledge through seminars, research activities, paper presentations, and industry networking opportunities.",
//     image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=60",
//     price:999,
//     location: "Electronics Department",

//     })

//     club.save().then((res)=>{
//         console.log(res);
        
//     }).catch((err)=>{
//         console.log(err);
//     })
//     res.send("everything is perfect")
// })



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);















app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Internal Server Error"}=err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("App is Listening On 8080");
})

