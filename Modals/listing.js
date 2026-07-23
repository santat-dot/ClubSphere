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

    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }

});


listingSchema.post("findOneAndDelete",(list)=>{
    if(list.length) {
        let reviewDel=Review.deleteMany({_id:{$in:list.reviews}})
    }
});


let listing=mongoose.model("listing",listingSchema);

module.exports = listing;