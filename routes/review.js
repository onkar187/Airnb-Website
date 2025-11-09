const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
let Review = require("../models/review");
let ExpressError = require("../utils/ExpressErrors");
let {reviewSchema} = require("../schema");
const {isLogged,isRviewAuthor,isLoggedAuthor} = require("../middleware");
const reviewControllers = require("../controllers/review");
let reviewValidate = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error) {
          let errMsg = error.details.map((el)=> el.message).join(",");
          throw new ExpressError (400,errMsg);
      }
      else {
          next();
      }
}

// review
// post reviewroute
router.post("/",isLogged, reviewValidate,reviewControllers.createReview);

// delete review route
router.delete("/:reviewId",isLoggedAuthor, isRviewAuthor,reviewControllers.deleteReview);

module.exports = router;
