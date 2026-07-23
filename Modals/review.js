const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        required: true
    },
    comment: {
        type: String,
        maxlength: 255
    },
    username: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Review", reviewSchema);