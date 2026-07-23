const express = require("express");
const router=express.Router({mergeParams:true});
const Review = require("../Modals/review.js");
const list = require("../Modals/listing.js");
const ExpressError = require("../utility/ExpressError.js");

module.exports.newReview=async(req,res)=>{
    let listing = await list.findById(req.params.id);
    if(!listing){
        throw new ExpressError(404, 'Listing not found');
    }
    let newReview = new Review(req.body.review);
    newReview.username = req.user.username;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log(`new review saved ${req.params.id}`);
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);

    await list.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    res.redirect(`/listings/${id}`);
}