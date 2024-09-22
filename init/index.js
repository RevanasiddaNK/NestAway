const mongoose = require("mongoose");
const Listing = require("../models/Listing.js");
const User = require("../models/User.js");
const { data } = require("./data");


require('dotenv').config();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
mapToken = 'pk.eyJ1IjoicmV2YW5hc2lkZGFuayIsImEiOiJjbHl1Nm84eTEwMHAwMm1wd3AzcDN5ang4In0.657X3f29PsZhwHPbBWoYtg'



const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const mongoUrl = 'mongodb://127.0.0.1/NestAwayAppDataBase'; // localhost:port/dbname


async function main() {
    try {
        await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connection successful");
    } catch (err) {
        console.error(`Error occurred: ${err}`);
        process.exit(1); // Exit process with failure
    }
}
main();

const initDB = async ()=>{
    await Listing.deleteMany({});
    let Data = data.map((obj)=>({
        ...obj, 
        owner:'669161d6e6aa4e760d6f36a5',
    }));
    await Listing.insertMany(Data);
    console.log("data was initialised");
};
//initDB();


async function updateDatabase() {
    try {
        const ownerUser = await User.findById('6692a4570b5c392dc0d48ac8');
        //  console.log(ownerUser);
        const updatedData = await Listing.updateMany({},{owner : ownerUser });
         // Insert new data
        console.log(" Updated data:",updatedData);
        
    } 
    catch (err) {
        console.error(`Error occurred while initializing database: ${err}`);
    }

}
//updateDatabase();


const initGeometry =  async () => {

    let listings =  await Listing.find({});
    for(let listing of listings){
        let mapBoxresponse = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
        }).send();
    
        const geometry = mapBoxresponse.body.features[0].geometry;
        await Listing.findByIdAndUpdate(listing._id, {geometry});
   }

};
initGeometry();







