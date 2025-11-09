const mongoose = require("mongoose");
const initData = require("./data");
let Listing = require("../models/listing");

main().then((res)=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err);
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async ()=>{
    await Listing.deleteMany();
    initData.data = initData.data.map((obj)=>({...obj,owner:"6906dad5706bdf57a6614dca"}))
    await Listing.insertMany(initData.data);
     console.log("data was initialized");
};

initDB();