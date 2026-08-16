const express = require("express");
const router = express.Router();
let ExpressError = require("../utils/ExpressErrors");
let {listingSchema,reviewSchema} = require("../schema");
const Listing = require("../models/listing");
const {isLogged} = require("../middleware");
const {isOwner} = require("../middleware");
const listingContrller = require("../controllers/listings");
const multer = require("multer");

const {storage} = require("../cloudConfig");
const upload = multer({storage});
const {cloudinary} = require("../cloudConfig");

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError (400,errMsg);
    }
    else {
        next();
    }
}

router
.route("/")
.get(listingContrller.index)
.post(isLogged,upload.single('listing[image]'),validateListing, listingContrller.createListing)

router.get("/new",isLogged,listingContrller.renderNewForm);

router.get("/search",listingContrller.searchListing);

router
.route("/:id/book")
.get(listingContrller.bookForm)
.post(listingContrller.bookListing);


router.route("/:id")
.get( listingContrller.showListing)
.put(isLogged,upload.single('listing[image]'),validateListing, listingContrller.updateListing)
.delete(isLogged, listingContrller.deleteListing);


// edit route
router.get("/:id/edit",isLogged, listingContrller.editListing);


module.exports = router;