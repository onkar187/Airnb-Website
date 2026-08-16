const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const guestSchema = new Schema ({
   name:String,
   email:String,
   phone:Number,
   guest:Number,
   checkIn:Date,
   checkOut:Date,
   createdAt: {
    type: Date,
    default: Date.now,
  },
   listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    },

});



const Guest = mongoose.model("Guest",guestSchema);

module.exports = Guest;

