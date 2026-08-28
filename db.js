const mongoose = require("mongoose");

const MONGODB_URI =
    process.env.AtlasUrl || process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MongoDB connection string is missing");
}

let cachedConnection = null;

async function connectMongoose() {
    // Already connected
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // Connection currently being established
    if (cachedConnection) {
        return cachedConnection;
    }

    cachedConnection = mongoose
        .connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,

            retryWrites: true,
            retryReads: true
        })
        .then(() => {
            console.log("MongoDB / Mongoose connected");
            return mongoose.connection;
        })
        .catch((error) => {
            cachedConnection = null;

            console.error(
                "MongoDB connection failed:",
                error.message
            );

            throw error;
        });

    return cachedConnection;
}

module.exports = {
    connectMongoose
};