if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const passport = require("passport");
const LocalStrategy = require("passport-local");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const { connectMongoose } = require("./db.js");

const ExpressError =
    require("./utility/ExpressError.js");

const User =
    require("./Modals/User.js");

const listingRouter =
    require("./routes/listings.js");

const reviewRouter =
    require("./routes/review.js");

const userRouter =
    require("./routes/user.js");


const app = express();

const port = process.env.PORT || 8080;


// ==========================================
// VIEW ENGINE
// ==========================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

app.engine("ejs", ejsMate);


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(methodOverride("_method"));

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ==========================================
// TRUST PROXY (needed on Render too, for secure cookies)
// ==========================================

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}


// ==========================================
// DATABASE CONNECTION
// ==========================================

async function ensureDatabaseConnection(
    req,
    res,
    next
) {
    try {

        await connectMongoose();

        next();

    } catch (error) {

        console.error(
            "Database connection error:",
            error
        );

        next(error);
    }
}


// ==========================================
// SESSION
// ==========================================

const mongoUrl =
    process.env.AtlasUrl ||
    process.env.MONGODB_URI;

if (!mongoUrl) {
    throw new Error(
        "AtlasUrl or MONGODB_URI is missing"
    );
}

const sessionStore =
    MongoStore.create({

        mongoUrl: mongoUrl,

        collectionName: "sessions",

        ttl:
            7 *
            24 *
            60 *
            60,

        touchAfter:
            24 *
            60 *
            60
    });


sessionStore.on(
    "error",
    (error) => {

        console.error(
            "Mongo session store error:",
            error
        );

    }
);


app.use(
    session({

        store: sessionStore,

        secret:
            process.env.Secret ||
            "development-secret",

        resave: false,

        saveUninitialized: false,

        cookie: {

            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite:
                process.env.NODE_ENV ===
                "production"
                    ? "none"
                    : "lax",

            maxAge:
                7 *
                24 *
                60 *
                60 *
                1000
        }
    })
);


// ==========================================
// PASSPORT
// ==========================================

app.use(
    passport.initialize()
);

app.use(
    passport.session()
);

passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);

passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);


// ==========================================
// CURRENT USER
// ==========================================

app.use(
    (req, res, next) => {

        res.locals.currentUser =
            req.user || null;

        next();
    }
);


// ==========================================
// DATABASE
// ==========================================

app.use(
    ensureDatabaseConnection
);


// ==========================================
// ROUTES
// ==========================================

app.use(
    "/listings",
    listingRouter
);

app.use(
    "/listings/:id/reviews",
    reviewRouter
);

app.use(
    "/",
    userRouter
);


// ==========================================
// ROOT
// ==========================================

app.get(
    "/",
    (req, res) => {

        res.redirect(
            "/listings"
        );

    }
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
    "/health",
    async (req, res) => {

        try {

            await connectMongoose();

            const connected =
                mongoose.connection
                    .readyState === 1;

            if (!connected) {

                return res
                    .status(503)
                    .json({
                        status: "error",
                        mongodb:
                            "disconnected"
                    });
            }

            return res
                .status(200)
                .json({
                    status: "ok",
                    mongodb:
                        "connected"
                });

        } catch (error) {

            console.error(
                "HEALTH ERROR:",
                error
            );

            return res
                .status(500)
                .json({
                    status: "error",
                    mongodb:
                        "failed",
                    message:
                        error.message
                });
        }
    }
);


// ==========================================
// 404
// ==========================================

app.use(
    (req, res, next) => {

        next(
            new ExpressError(
                404,
                "Page Not Found!"
            )
        );
    }
);


// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
    (err, req, res, next) => {

        console.error(
            "APPLICATION ERROR:",
            err
        );

        const {
            statusCode = 500,
            message =
                "Internal Server Error"
        } = err;

        res
            .status(statusCode)
            .render(
                "error.ejs",
                {
                    message
                }
            );
    }
);


// ==========================================
// EXPORT (used if you ever deploy to Vercel too)
// ==========================================

module.exports = app;


// ==========================================
// START SERVER — always runs now, on Render and locally
// ==========================================

connectMongoose()
    .then(() => {

        app.listen(
            port,
            () => {

                console.log(
                    `Server started on port ${port}`
                );

            }
        );

    })
    .catch(
        (error) => {

            console.error(
                "Failed to start:",
                error
            );

            process.exit(1);
        }
    );