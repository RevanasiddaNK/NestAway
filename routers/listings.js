const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controller/listing.js");
const { 
        isLoggedIn,
        isOwner,
        validateListing,
        } 
        = require("../middlewares.js");

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const {storage , cloudinary} = require("../cloudConfig.js");

const multer  = require('multer');
const listing = require("../controller/listing.js");
const {Listing} = require("../models/Listing.js");

const upload = multer({ storage });



router.route("/")

    // Route: Get all listings
    .get(
        wrapAsync(listingController.index)
    )

    // Route: Create a new listing
    .post(  
        upload.single("newListing[Imagefile]"),     
        validateListing,
        wrapAsync(listingController.createListing)
    )

router.route("/search")
    .get(
        wrapAsync(listingController.searchDestination)
    );

router.route("/new")

    // Route: Render form for creating a new listing
    .get(
        isLoggedIn, 
        listingController.renderFormForNewListing
    );


router.route("/:id")

    // Route: Get a specific listing by ID
    .get(
        wrapAsync( listingController.showListing)
    )

    // Route: Delete a listing by ID
    .delete(
        isOwner,
        isLoggedIn,
        wrapAsync( listingController.destroyListing )
    )


router.route( "/edit/:id")

    // Route: Update a listing by ID
    .put(
        upload.single("EditListing[Imagefile]"),
        isOwner,
        validateListing,
        wrapAsync( listingController.updateListing )
    )

    // Route: Render form for editing a listing by ID
    .get(
        isLoggedIn,
        isOwner,
       listingController.renderEditFormForListing
    );

router.route("/filter/:Ltype")
    .get(
        listingController.filterListing
    );






    

module.exports = router;
