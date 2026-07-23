const express = require("express");
const router=express.Router({mergeParams:true});
const list = require("../Modals/listing.js");
const Review = require("../Modals/review.js");
const wrapAsync = require("../utility/wrapAsync.js");
let {listingSchema,reviewSchema} = require("../schemaValidation.js");
let ExpressError=require("../utility/ExpressError.js");
const reviewControlRouter = require("../controller/review.js");




const validateSchema=async(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((err)=>err.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
}

router.post("/",validateSchema,wrapAsync(reviewControlRouter.newReview));


router.delete("/:reviewId",wrapAsync(reviewControlRouter.deleteReview))




module.exports=router;