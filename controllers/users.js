const {saveRedirecturl} = require("../middleware");
const User = require("../models/user");
const passport = require("passport");


module.exports.signupForm =(req,res)=>{
    res.render("user/signup")
};

module.exports.signup =async(req,res,next)=>{
try {
     let {username,email,password} = req.body;
 let newUser = new User({email,username});
  let registeredUser = await User.register(newUser,password);

  req.login(registeredUser,(err)=>{
    if(err){
       return next(err);
    }
    req.flash("success","welocome to wanderlust");
  res.redirect("/listings");
  })
  
}
catch(err)
{
    req.flash("error",err.message);
    res.redirect("/signup");
}
}

module.exports.renderLoginForm =(req,res)=>{
    res.render("user/login");
};

module.exports.login = async(req,res)=>{

    req.flash("success","Welcome  back to wanderlust you are loggoed in");
    redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
 req.logOut((err)=>{
    if(err){
       return next(err)
    }
    req.flash("success","you are logged out now")
    res.redirect("/listings");
 })
}
