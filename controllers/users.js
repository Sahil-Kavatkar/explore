const User = require("../models/user.js");

module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs",{errmsg: req.flash("error")});
}

module.exports.signupdetails=async(req,res)=>{
    try{
    let {username , email, password}= req.body;
    const newUser = new User ({username , email});
    const registeredUser = await User.register(newUser, password); 
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        } req.flash("success","You have successfully registered");
        res.redirect("/listings");
    })
   
  }catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}

module.exports.login=(req,res)=>{
    res.render("users/login.ejs",{errmsg :req.flash("error")});
}

module.exports.loginpost=async(req,res)=>{
    req.flash("success","you are logged in") ;
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 }

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","You have logged out");
      res.redirect("/listings");
    });
} 
