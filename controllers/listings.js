const Listing = require("../models/listing.js");

module.exports.index=async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings , msg: req.flash("success")});
     
 }

module.exports.cities=async (req,res)=>{
    const allListings = await Listing.find({category:"Iconic-Cities"});
    res.render("listings/filters/cities.ejs", {allListings});
 } 

module.exports.farm=async (req,res)=>{
    const allListings = await Listing.find({category:"Farm"});
    res.render("listings/filters/farm.ejs", {allListings});
 }  

 module.exports.mountains=async (req,res)=>{
    const allListings = await Listing.find({category:"Mountains"});
    res.render("listings/filters/mountains.ejs", {allListings});
 } 

 module.exports.beach=async (req,res)=>{
    const allListings = await Listing.find({category:"Beach"});
    res.render("listings/filters/beach.ejs", {allListings});
 }
module.exports.rooms=async (req,res)=>{
    const allListings = await Listing.find({category:"Rooms"});
    res.render("listings/filters/rooms.ejs", {allListings});
 }

 module.exports.new= (req , res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req , res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"},}).populate("owner");
    res.render("listings/show.ejs",{listing, msg: req.flash("success"), errmsg: req.flash("error")});
}

module.exports.createListing=async (req, res, next)=>{
    const { path: url, filename } = req.file;
    // const newListing = new Listing(req.body.listing);
    // newListing.owner= req.user._id;
     const newListing = new Listing({
        ...req.body.listing,
        owner: req.user._id,
        image: { url, filename },
    });
    if (!newListing.image) {
        newListing.image = { url: '', filename: '' };
    }
    await newListing.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings");
    }

module.exports.editListing=async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    req.flash("error", "You dont have permission to edit");
    res.render("listings/edit.ejs",{listing});
}    

module.exports.updated=async (req, res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing} );
    req.flash("success","Listing has been edited !");
    res.redirect(`/listings/${id}`);
}

module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing has been deleted !");
    res.redirect("/listings");
}