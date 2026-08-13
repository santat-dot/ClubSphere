let mongoose = require("mongoose");
let Schema=mongoose.Schema;

let Review=require("./review.js");

let listingSchema = mongoose.Schema({
    title : {
        type:String,
        required:true,
    },
    description : String,
    image : {
        url: String,
        filename: String,
    },
    price : {
        type:Number,
        default:0,
    },
    location : String,
    category : {
        type:String,
        default:"clubs",
    },
    country : {
        type:String,
        default:"India",
    }

    ,reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    geometry: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    }

});


listingSchema.post("findOneAndDelete", async (list) => {
    if (list) {
        try {
            await Review.deleteMany({ _id: { $in: list.reviews } });
        } catch (e) {
            console.error("Error deleting associated reviews:", e);
        }
    }
});


let listing=mongoose.model("listing",listingSchema);

module.exports = listing;