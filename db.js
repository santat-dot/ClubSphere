const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const MONGODB_URI =
    process.env.AtlasUrl || process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MongoDB connection string is missing");
}


// ==========================================
// MONGOOSE CONNECTION
// ==========================================

let mongoosePromise = null;

async function connectMongoose() {

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!mongoosePromise) {

        mongoosePromise = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            socketTimeoutMS: 45000,

            retryWrites: true,
            retryReads: true,

            tls: true
        })
        .then(() => {

            console.log("MongoDB / Mongoose connected");

            return mongoose.connection;

        })
        .catch((error) => {

            mongoosePromise = null;

            console.error(
                "MongoDB connection failed:",
                error.message
            );

            throw error;
        });
    }

    return mongoosePromise;
}


// ==========================================
// NATIVE MONGODB CLIENT
// ==========================================

let mongoClientPromise = null;

function getMongoClient() {

    if (!mongoClientPromise) {

        const client = new MongoClient(MONGODB_URI, {

            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            socketTimeoutMS: 45000,

            retryWrites: true,
            retryReads: true,

            tls: true
        });

        mongoClientPromise = client.connect()
            .then(() => {

                console.log(
                    "MongoDB native client connected"
                );

                return client;

            })
            .catch((error) => {

                mongoClientPromise = null;

                console.error(
                    "Native MongoDB connection failed:",
                    error.message
                );

                throw error;
            });
    }

    return mongoClientPromise;
}


module.exports = {
    connectMongoose,
    getMongoClient
};