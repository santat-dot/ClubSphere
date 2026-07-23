const express = require("express");
const router = express.Router();
const list = require("../Modals/listing.js");
const wrapAsync = require("../utility/wrapAsync.js");
let { listingSchema, reviewSchema } = require("../schemaValidation.js");
let ExpressError = require("../utility/ExpressError.js");
const passport = require("passport");
const listingRouteController = require("../controller/listings.js");

const multer = require("multer");
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = async (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

router
  .route("/")
  .get(listingRouteController.allListings)
  .post(
      upload.single("listing[image]"),
      validateListing,
      wrapAsync(listingRouteController.showListingsPost)
  );

router.get(
    "/create",
    wrapAsync(listingRouteController.createListingForm)
);

router
  .route("/:id")
  .get(wrapAsync(listingRouteController.showListingsform))
  .put(
      upload.single("listing[image]"),
      wrapAsync(listingRouteController.editListing)
  )
  .delete(wrapAsync(listingRouteController.deleteListing));

router.get(
    "/:id/edit",
    wrapAsync(listingRouteController.editListingForm)
);
module.exports = router;
