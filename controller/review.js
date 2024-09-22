const express = require("express");
const ExpressError = require("../utils/ExpressError.js");
const {Listing} = require("../models/Listing.js");
const Review = require("../models/Review.js");

module.exports = {

    createReview : async (req, res, next) => {
        let { id } = req.params; // Use mergeParams to capture `id` from the parent router
        let listing = await Listing.findById(id);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        let newReview = new Review(req.body.newReview);
        newReview.author = res.locals.currentUser,
        await newReview.save();

        listing.reviews.push(newReview);
        await listing.save();

        // console.log(newReview);
        // console.log(listing);

        req.flash("success", "New review saved!");
        res.redirect(`/listings/${id}`);
    },

    deleteReview : async (req, res, next) => {
        
        const { id, reviewID } = req.params;
        //console.log( id);
        //console.log(reviewID);
        let listing = await Listing.findById(id);
        //console.log( listing);
        if (!listing) {
           throw new ExpressError(404, "Listing not found");
        }

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
        await Review.findByIdAndDelete(reviewID);

        req.flash("success", "Review deleted");
        res.redirect(`/listings/${id}`);
    }

};