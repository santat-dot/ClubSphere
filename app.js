if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const passport = require("passport");
const LocalStrategy = require("passport-local");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const mongoose = require("mongoose");

const {
    connectMongoose,
    getMongoClient
} = require("./db.js");

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
// EXPRESS
// ==========================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

app.engine("ejs", ejsMate);

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
// TRUST PROXY
// ==========================================

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}


// ==========================================
// SESSION
// ==========================================

const mongoClientPromise =
    getMongoClient();

const sessionStore =
    MongoStore.create({

        clientPromise:
            mongoClientPromise,

        collectionName: "sessions",

        touchAfter: 24 * 3600
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
// DATABASE BEFORE ROUTES
// ==========================================

app.use(
    async (req, res, next) => {

        try {

            await connectMongoose();

            next();

        } catch (error) {

            console.error(
                "Database middleware error:",
                error
            );

            next(error);
        }
    }
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
// HEALTH
// ==========================================
app.get("/health", async (req, res) => {
    try {
        await connectMongoose();

        res.status(200).json({
            status: "ok",
            mongodb: mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
        });

    } catch (error) {
        console.error("HEALTH ERROR:", error);

        res.status(500).json({
            status: "error",
            mongodb: "failed",
            message: error.message
        });
    }
});


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
// EXPORT
// ==========================================

module.exports = app;


// ==========================================
// LOCAL SERVER
// ==========================================

if (
    process.env.NODE_ENV !==
    "production"
) {

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
                    error.message
                );

                process.exit(1);
            }
        );
}