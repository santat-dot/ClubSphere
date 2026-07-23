const express = require("express");
const router=express.Router();
const list=require("../Modals/listing")
const ExpressError = require("../utility/ExpressError.js");
const { listingSchema } = require("../schemaValidation.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.mapToken;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.allListings = async (req,res)=>{
    const search = req.query.search?.trim() || "";
    const category = req.query.category || "";
    
    let query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;

    const allListings = await list.find(query);
    res.render("listings/index", { allListings, search, category });
}

module.exports.createListingForm= async(req,res)=>{
    if(!req.isAuthenticated()){
        
       
        
        return res.redirect("/listings");
       
    }
    res.render("listings/create.ejs");
}

module.exports.showListingsform=async (req,res)=>{
    let {id}=req.params;
    const listingData = await list.findById(id).populate("reviews");
    if(!listingData){
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show", { listingData });
}

module.exports.showListingsPost=async (req,res)=>{
    let result=listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(404,result.error);
    }
    
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()

    console.log(response.body.features[0].geometry);
    
    let newInfo =new list(req.body.listing);
    if(req.file){
        newInfo.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    newInfo.geometry= response.body.features[0].geometry;

    let info =await newInfo.save();
    console.log(info);
    res.redirect("/listings");
}


module.exports.editListingForm=async (req,res)=>{
    let {id}=req.params;
    let findlist = await list.findById(id);
    res.render("listings/edit", { findlist });
}


module.exports.editListing = async (req, res) => {
    let { id } = req.params;

    // Geocode the location if it's being updated
    if (req.body.listing.location) {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();
        
        req.body.listing.geometry = response.body.features[0].geometry;
        console.log("Updated geometry for location:", req.body.listing.location);
    }

    let listing = await list.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }

    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing=async (req,res)=>{
    let {id} = req.params;
    await list.findByIdAndDelete(id);
    res.redirect("/listings");
}