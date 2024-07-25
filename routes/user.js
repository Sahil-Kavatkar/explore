const express = require("express");
const router = express.Router({mergeParams:true});
const{saveRedirectUrl}= require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("../models/user.js");
const userController = require("../controllers/users.js");
//signup

router.get("/signup",userController.signup);

router.post("/signup",wrapAsync(userController.signupdetails));

//login
router.get("/login",userController.login);

router.post("/login", saveRedirectUrl ,passport.authenticate("local",{failureRedirect:'/login', failureFlash:true,}),userController.loginpost);

//logout
router.get("/logout",userController.logout);

module.exports= router;