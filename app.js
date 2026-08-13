if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const fallbackDbUrl = "mongodb://127.0.0.1:27017/wanderlust";

// Prefer AtlasUrl or MONGODB_URI for production. Only fall back to local DB when
// running in non-production (local development).
const configuredDbUrl = process.env.AtlasUrl || process.env.MONGODB_URI;
const dburl = configuredDbUrl || (process.env.NODE_ENV !== "production" ? fallbackDbUrl : null);

const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utility/ExpressError.js");

const Review = require("./Modals/review.js");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const port = process.env.PORT || 8080;

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

const User = require("./Modals/User.js");


const app = express();


// ===============================
// VIEW ENGINE
// ===============================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);


// ===============================
// DATABASE CONNECTION
// ===============================

// -------------------------------
// Cached DB connection for serverless environments
// -------------------------------
let cachedConnection = null;
async function connectDb() {
    if (cachedConnection) return cachedConnection;
    if (!dburl) {
        console.warn("No MongoDB URL configured (AtlasUrl or MONGODB_URI). Skipping DB connect.");
        return null;
    }
    cachedConnection = mongoose
        .connect(dburl)
        .then((conn) => {
            console.log(`Database connected: ${dburl.startsWith("mongodb://127.0.0.1") ? "local" : "Atlas"}`);
            return conn;
        })
        .catch((err) => {
            console.error(`Database connection failed for ${dburl}:`, err.message || err);
            return null;
        });
    return cachedConnection;
}

// ===============================
// SESSION + PASSPORT (synchronously register so Vercel can import app)
// ===============================
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

const sessionStore = dburl
    ? MongoStore.create({
          mongoUrl: dburl,
          crypto: { secret: process.env.Secret },
          touchAfter: 24 * 3600,
      })
    : null;

const sessionOptions = {
    store: sessionStore || undefined,
    secret: process.env.Secret || "devsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

if (sessionStore) {
    sessionStore.on("error", (err) => console.error("Mongo Store Error:", err));
}

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Root redirect
app.get("/", (req, res) => res.redirect("/listings"));

// 404
app.use((req, res, next) => next(new ExpressError(404, "Page Not Found!")));

// Error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Internal Server Error" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Export app synchronously for Vercel
module.exports = app;

// Start local server and connect DB in development only
if (process.env.NODE_ENV !== "production") {
    connectDb().then((conn) => {
        if (!conn) {
            console.error("Failed to connect to DB in development. Exiting.");
            process.exit(1);
        }
        app.listen(port, () => console.log(`Server started on port ${port}`));
    });
} else {
    // attempt connection in production but do not crash the lambda on failure
    connectDb();
}