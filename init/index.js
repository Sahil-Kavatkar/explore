// if (process.env.NODE_ENV != "production") {
//   require('dotenv').config();
// }

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL ="mongodb://127.0.0.1:27017/whatsapp15";
// const dbUrl = process.env.ATLASDB_URL;

main()
 .then(() =>{
    console.log("connected to db");
 }).catch((err) =>{
     console.log(err);
 });
  
 async function main(){
     await mongoose.connect(MONGO_URL);
 }

 const initDB = async () => {
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj , owner:"6675f4306186e0cdfa37fc9b"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  };

initDB();