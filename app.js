if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
let ExpressError = require("./utils/ExpressErrors");
let listingsRouter =require("./routes/listing");
let reviewsRouter =require("./routes/review");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require("./routes/user");
const aiRouter = require("./routes/ai");
const dbUrl =process.env.ATLASDB_URL;
const MongoStore = require('connect-mongo');

const Listing = require("./models/listing");
const {sampleListings} = require("./init/data");



// const store = MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:process.env.SECRET
//     },
//     touchAfter:24 *3600,
// })

// store.on("error",()=>{
//     console.log("ERROR IN MONGO SESSION STORE",err);
// })
const sessionOptions = {
      secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true    ,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge:7 * 24 * 60 * 60* 1000,
        httpOnly:true,
    }
};

main().then((res)=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err);
})
app.use(express.urlencoded({extended:true}));

 const methodOverride = require('method-override');
 app.use(express.json());
const review = require("./models/review");

 app.use(methodOverride('_method'));

async function main() {
  await mongoose.connect(dbUrl);

  
}

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})



// app.get("/",(req,res)=>{
//     res.send("Hi, I am root")
// })



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.get("/alldata",async(req,res)=>{
   
    await Guest.collection.drop();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.use("/ai", aiRouter);


app.use("/",listingsRouter);
app.use((req, res, next) => {

throw new ExpressError(404,"Page Not Found");
});


app.use((err,req,res,next)=>{
    let {statusCode = 500,message="something went wrong"} = err;
    
    res.render("error.ejs",{message});
   
})


app.get("/",(req,res)=>{
    res.send("hello");
})













