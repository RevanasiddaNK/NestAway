const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User.js");
const { required } = require("joi");

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author : {
        type : Schema.Types.ObjectId ,
        ref : User,
        required : true,
    },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
