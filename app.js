if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("./schema.js");
const session = require("express-session");
const MongoStore= require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");
const{isLoggedIn}= require("./middleware.js");
const{saveRedirectUrl}= require("./middleware.js");
const{isOwner, isAuthor}= require("./middleware.js");
const multer=require("multer");
const {storage} = require("./cloudConfig.js");
const upload= multer({storage});

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;

main().then(() =>{
   console.log("connected to db");
}).catch((err) =>{
    console.log(err);
});
 
async function main(){
    await mongoose.connect(dbUrl);
};

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));

app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR in MongoStore",err);
});

const sessionOptions={
  store,  
  secret: process.env.SECRET,
  
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req, res)=>{
//     let fakeUser = new User({
//         email: "sahilkavatkar@gmail.com",
//         username:"Sahil"
//     });
//     let registeredUser=await User.register(fakeUser, "2004");
//     res.send(registeredUser);
// });

app.get("/",(req,res)=>{
    res.send("hi, i am root");
});




app.use("/listings",listings);

app.use("/listings/:id/reviews", reviews);

app.use("/", users);

//create route
// app.post("/listings",async (req, res)=>{
//   //let {title, description, iamge, price, country, location}=req.body;
//   let listing = req.body.listing;
//   let newList = new Listing (listing);
//   newList.save().then(()=>{
//     console.log("chat was saved");
//     res.redirect("/listings");
//   }).catch((err)=>{
//     console.log(err);
//     res.redirect("/listings/new")
//   });
// });

//   app.post("/listings",async (req, res, next)=>{
//     try{
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
//     } catch(err){
//         next(err);
//     }
//   });




// app.get("/testListing",async (req,res)=>{
//    let sampleListing = new Listing({
//     title: "My home",
//     description:"by the beach",
//     price: 1300,
//     location: "goa",
//     country: "india",
//    });

//    await sampleListing.save();
//    console.log("Sample was saved");
//    res.send("Successful testing");

// });

app.all("*", (req, res, next)=>{
   next(new ExpressError (404,"page not found!")) ;
});

app.use((err, req ,res , next)=>{
 let{status=500, message="Something went wrong"} = err;  
 res.render("error.ejs",{message});
 //res.status(status).send(message);
});

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
}); 