const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const{isLoggedIn}= require("../middleware.js");
const{isOwner, isAuthor}= require("../middleware.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js");

//Review
const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};
//create review

router.post("/",isLoggedIn, validateReview , wrapAsync(reviewController.createReview)); 
 
 //delete review
router.delete("/:reviewId", isLoggedIn,isAuthor, wrapAsync(reviewController.deleteReview));

module.exports= router;