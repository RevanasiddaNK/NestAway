const express = require("express");
const ExpressError = require("../utils/ExpressError.js");
const {Listing, FilterTypes} = require("../models/Listing.js");

const Review = require("../models/Review.js");
const User = require("../models/User.js");

if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




module.exports = {

    index : async (req, res, next) => {
        let allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings, FilterTypes });
    },

    createListing : async (req, res, next) => { 
        
        let { newListing } = req.body;

        let mapBoxresponse = await geocodingClient.forwardGeocode({
            query: newListing.location,
            limit: 1
        }).send();

        // console.log(mapBoxresponse.body.features[0].geometry.coordinates);
        const geometry = mapBoxresponse.body.features[0].geometry;
        // console.log(geometry);
       
        // console.log(req.file);
        let {filename}  = req.file;
        let url = req.file.path;

        newListing.owner = req.user._id;
        let NewListing = new Listing(newListing);
        NewListing.geometry = geometry;
        NewListing.image = {url,filename};
        // console.log(NewListing.image);
        await NewListing.save();

        req.flash("success", `New Listing ${newListing.title} is created!`);
        res.redirect("/listings");
    
    },

    showListing : async (req, res, next) => {

        let { id } = req.params;
        
        let showlisting = await Listing.findById(id).populate('reviews')
                                                    .populate("owner");
        if (!showlisting) {
            req.flash("error", "Requested Listing doesn't exist"); 
        }

        // console.log(showlisting);  

        res.render("listings/show.ejs", { showlisting , mapToken});
    },

    renderFormForNewListing : (req, res, next) => {
        res.render("listings/new.ejs" ,{FilterTypes});
    },

    destroyListing : async (req, res, next) => {
        let { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        req.flash("success", `${deletedListing.title} Listing is deleted!`);
        res.redirect("/listings");
    },

    updateListing1 : async (req, res, next) => {
        //console.log(req.file);
        let { id } = req.params;
        let { newListing } = req.body;

        console.log(NewListing.FilterType);
        res.send("Workig")

    },


    updateListing : async (req, res, next) => {
        //console.log(req.file);
        let { id } = req.params;
        let { newListing } = req.body;
       
        let mapBoxresponse = await geocodingClient.forwardGeocode({
            query: newListing.location,
            limit: 1
        }).send();

        // console.log(mapBoxresponse.body.features[0].geometry.coordinates);
        const geometry = mapBoxresponse.body.features[0].geometry;
        // console.log(geometry);

        newListing.geometry = geometry;

        if(newListing.filterType == 'Choose...'){
            let listing = await Listing.findById(id);
            newListing.filterType = listing.filterType;
        }

        await Listing.findByIdAndUpdate(id, newListing);


        if (req.file) {
            let url  = req.file.path;
            let {filename} = req.file;
            await Listing.findByIdAndUpdate(id, { $set: { image: { url, filename } } });
        } 
        
        
        req.flash("success", `${newListing.title} Listing is updated successfully!`);
        res.redirect(`/listings/${id}`);
    },

    renderEditFormForListing : async (req, res, next) => {
        let { id } = req.params;
        let EditListing = await Listing.findById(id);
        let originalImage = EditListing.image.url;
        let EditImage = originalImage.replace("/upload", "/upload/c_fill,h_200,w_250/e_blur:100");
        res.render("listings/edit.ejs", { EditListing,EditImage, FilterTypes });
    },

    searchDestination : async (req, res,next) => {
        
            const query = req.query.searchQuery;
            const queryListings = await Listing.fuzzySearch({ query: query, exact:true } );


            if( queryListings.length == 0){
                req.flash("error", `Destination " ${query} " is not listed on NestAway! `);
                res.redirect("/listings")
            }

            res.render("listings/index.ejs", { allListings: queryListings , query,FilterTypes });
        

    },

    filterListing: async (req, res, next) => {

            let { Ltype } = req.params;
    
            if (!Ltype) {
                req.flash("error", "Filter type is not provided.");
                return res.redirect('/');
            }
    
            let filteredListings = await Listing.find({ filterType: Ltype });
            //console.log("Filtered Listings Data: ", filteredListings); // Verify the data structure
    
            if (filteredListings.length === 0) {
                req.flash("info", "No listings found for the selected filter.");
            }
    
            res.render("listings/index.ejs", { allListings: filteredListings , FilterTypes});
    
    
    }

}

