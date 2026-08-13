if(process.env.NODE_ENV!="production"){
    const dotEnv=require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const fallbackDbUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.AtlasUrl || process.env.MONGODB_URI || fallbackDbUrl;
const methodOverride = require("method-override");
const path = require("path");
const ejsMate=require("ejs-mate");
let ExpressError=require("./utility/ExpressError.js");
const Review = require("./Modals/review.js");
let session = require("express-session");
const MongoStore = require("connect-mongo").default;
const port = process.env.PORT || 8080;
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





async function connectDb(url) {
    try {
        await mongoose.connect(url);
        console.log(`Database connected: ${url.startsWith("mongodb://127.0.0.1") ? "local" : "Atlas"}`);
        return true;
    } catch (err) {
        console.log(`Database connection failed for ${url}:`, err.message);
        return false;
    }
}

let effectiveDbUrl = dburl;

async function main() {
    const connectedToAtlas = await connectDb(dburl);
    if (!connectedToAtlas && dburl !== fallbackDbUrl) {
        console.log("Falling back to local database...");
        effectiveDbUrl = fallbackDbUrl;
        const connectedLocal = await connectDb(fallbackDbUrl);
        if (!connectedLocal) {
            console.error("Both Atlas and local database connection failed. Exiting.");
            process.exit(1);
        }
    }
    return effectiveDbUrl;
}

main().then((url) => {
    const store = MongoStore.create({
        mongoUrl: url,
        crypto: {
            secret: process.env.Secret || "mysecrete",
        },
        touchAfter: 24 * 3600,
    });

    let sessionOptions = {
        store,
        secret: process.env.Secret || "mysecrete",
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
    };

    store.on("error", (err) => {
        console.log("Error in Mongo Session Store", err);
    });

    app.use(session(sessionOptions));

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        next();
    });

    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);

    app.use((req, res, next) => {
        next(new ExpressError(404, "Page Not Found!"));
    });

    app.use((err, req, res, next) => {
        let { statusCode = 500, message = "Internal Server Error" } = err;
        res.status(statusCode).render("error.ejs", { message });
    });

    if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

module.exports = app;
});


