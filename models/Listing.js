const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js");
const User = require("./User.js");
const { ref, required, string } = require("joi");
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const { type } = require("./schemas/listingSchema.js");

const defaultUrl = "https://a0.muscache.com/im/pictures/miso/Hosting-53274539/original/365299e3-f926-47ee-bcbf-606d6a0370b9.jpeg?im_w=1200&im_q=highq";

const ListingSchema = new Schema({

    title: {
        type: String,
        required: true,
    },

    owner : {
        type : Schema.Types.ObjectId,
        ref : User,
       required: true,
    },

    description: {
        type: String,
    },

    price: {
        type: Number,
        required: true,
    },

    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
            default: defaultUrl,
            set: v => v === "" ? defaultUrl : v,
        },
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    
    location: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    },

    geometry: {

        type: {
            type : String,
            enum : ['Point'],
            
        },

        coordinates: {
            type : [Number],       
        }
    },

    filterType: {
    type : String,
    required : true
    },
    
});


ListingSchema.plugin(mongoose_fuzzy_searching, { fields: [ 'title', 'location', 'country' ] });



ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

let FilterTypes = 
    [   'house-flood-water', 'mountain-city', 'tree-city', 'ship',
        'landmark-dome', 'fire', 'bed', 'tower-observation',
        'umbrella-beach', 'seedling', 'bath', 'plane'
    ]

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = {Listing, FilterTypes};
