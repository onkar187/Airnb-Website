let Listing = require("../models/listing");
let Guest = require("../models/Guest")

module.exports.index = async (req,res)=>{
const allListings =  await Listing.find({});
res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm =(req,res)=>{
  
    res.render("listings/new");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id).populate({path:"reviews",
    populate:{
        path:"author"
    },
   }).populate("owner");
   if (!listing) {
      req.flash("error", "The listing you requested does not exist");
     return  res.redirect("/listings");
    }
   
   res.render("listings/show.ejs",{listing});
// console.log(listing);
}

module.exports.createListing =async(req,res,next)=>{
let url = req.file.path;
let filename = req.file.filename;
 let newListing =new Listing (req.body.listing);
 newListing.image = {url,filename};
 newListing.owner = req.user._id;
 await newListing.save();
// console.log(url," ",filename);
 req.flash("success","New Listing Created");
 res.redirect("/listings");
}

module.exports.editListing =async(req,res)=>{
    let {id} = req.params;
     const listing =  await Listing.findById(id);
     if(!listing){
    req.flash("error","Listing you requested for does not exists");
    res.render("/listings");
   }
   let originalImageUrl = listing.image.url;
  originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250")
   res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing =async(req,res)=>{
  let {id} = req.params;
let listing =  await  Listing.findByIdAndUpdate(id,{...req.body.listing});
if(typeof req.file !== "undefined"){
        let url = req.file.path;
let filename = req.file.filename;
listing.image = {url,filename};
 await listing.save();
    }
 req.flash("success","Listing is updated");
 res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
  let deletedListing =  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted")
    res.redirect("/listings");
};

module.exports.searchListing = async(req,res)=>{
   
 //console.log(req.body);
   let {destination} = req.query;
    let allListings =  await Listing.find({});
    allListings = allListings.filter((list) =>
    list.location.toLowerCase() === destination.toLowerCase() ||
    list.country.toLowerCase() === destination.toLowerCase()
    );

    if(allListings.length ==0)
    {
        req.flash("error","No destination available");
      return  res.redirect("/listings");
    }

    res.render("listings/destination.ejs",{allListings});
//console.log(listing);
}


module.exports.bookForm = async (req,res)=>{
   let {id} = req.params;
   
   res.render("listings/book.ejs",{id});
    


}


module.exports.bookListing= async(req,res)=>{

 let {id} = req.params   

 const { checkIn, checkOut } = req.body.guest;

    // Check whether dates are already booked
    const existingBooking = await Guest.findOne({
        listing: id,
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) }
    });

    if (existingBooking) {
        req.flash(
            "error",
            "Listing is already booked for these dates"
        );

        return res.redirect(`/listings/${id}`);
    }

let book = new Guest(req.body.guest);
 book.listing = id ;
await book.save();
req.flash("success","Booked Succssfully");
 res.redirect("/listings");
}


