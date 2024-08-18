const Listing = require("./models/listing");
const Review = require("./models/review")

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
       }
    next();    
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req, res, next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You dont have permission to edit");
        return res.redirect(`/listings/${id}`);
    } next();
}

module.exports.isAuthor=async(req, res, next)=>{
    let {id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You dont have permission to edit");
        return res.redirect(`/listings/${id}`);
    } next();
}