const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let Review = require("./review");
const listingSchema = new Schema({
 title:{
    type:String,
   
 },
description:String,
image: {
    filename: String,
    url: String
  },
price:Number,
location:String,
country:String,
reviews:[{
 type:Schema.Types.ObjectId,
 ref:"Review",
}],
owner:{
  type:Schema.Types.ObjectId,
  ref:"User"
},

category:{
  type:String,
  enum:["mountains","arctic","farms","rooms","iconic cities"]
}
}

);

listingSchema.post("findOneAndDelete",async(doc)=>{
  if(doc && doc.reviews.length)
  {
    let res = await Review.deleteMany({_id:{$in:doc.reviews}});
    console.log(res);
  }
})
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

