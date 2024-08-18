const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const{isLoggedIn}= require("../middleware.js");
const{saveRedirectUrl}= require("../middleware.js");
const{isOwner, isAuthor}= require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer=require("multer");
const {storage} = require("../cloudConfig.js");
const upload= multer({storage});

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};


//Index route
router.get("/",wrapAsync(listingController.index));
 
//filters
router.get("/cities",wrapAsync(listingController.cities));
router.get("/farm",wrapAsync(listingController.farm));
router.get("/mountains",wrapAsync(listingController.mountains));
router.get("/beach",wrapAsync(listingController.beach));
router.get("/rooms",wrapAsync(listingController.rooms));

 //New route
router.get("/new", isLoggedIn, listingController.new );
 
 //Show route
 router.get("/:id", wrapAsync(listingController.showListing));

 //create route
 router.post("/" ,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

//edit rout
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));

//update route 
router.put("/:id",upload.single('listing[image]'),validateListing ,isLoggedIn, isOwner, wrapAsync(listingController.updated));

//delete route
router.delete("/:id", isLoggedIn , isOwner, wrapAsync(listingController.delete));

module.exports = router;