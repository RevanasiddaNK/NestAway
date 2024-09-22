
const passport = require("passport");
const {Listing} = require("./models/Listing.js");
const Review = require("./models/Review.js");

const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");

const listingSchemaJoi = require("./models/schemas/listingSchema.js");
const reviewSchemaJoi = require("./models/schemas/reviewSchema.js");

module.exports = {
    // Middleware: Check if the user is logged in
    isLoggedIn: (req, res, next) => {
        try {
            if (!req.isAuthenticated()) {
                req.session.redirectURL = req.originalUrl;
                req.flash("error", "You are not Logged in!");
                res.redirect("/login");
            } else {
                next();
            }
        } catch (err) {
            // console.log("ERROR at logging in");
            throw new ExpressError(err.message);
        }
    },

    // Middleware: Save the redirect URL
    saveRedirectURL: (req, res, next) => {
        if (req.session.redirectURL &&
            !req.session.redirectURL.includes('?_method=DELETE')  &&
            !req.session.redirectURL.includes('/reviews/')
        ){
            //console.log(req.session);
            //console.log(req.session.redirectURL)
            res.locals.redirectURL = req.session.redirectURL;
        }
        else{
            res.locals.redirectURL = '/listings';
        }
        next();
    },

    // Middleware: Validate a listing using Joi
    validateListing: (req, res, next) => {
        const { newListing } = req.body;
        const { error } = listingSchemaJoi.validate(newListing);

        if (error) {
            const errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            next();
        }
    },

    // Middleware: Validate a review using Joi
    validateReview: (req, res, next) => {
        const { newReview } = req.body;
        const { error } = reviewSchemaJoi.validate(newReview);

        if (error) {
            const errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            next();
        }
    },

    // Middleware: Check if the current user is the owner of the listing
    isOwner: wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const currListing = await Listing.findById(id);

        if (!currListing.owner.equals(res.locals.currentUser._id)) {
            req.flash("error", `You are not the owner of ${currListing.title}`);
            res.redirect(`/listings/${id}`);
        } else {
            next();
        }
    }),

    // Middleware: Check if the current user is the author of the review
    isReviewAuthor: wrapAsync(async (req, res, next) => {
        const { id, reviewID } = req.params;
        const currReview = await Review.findById(reviewID);

        if (!currReview.author.equals(res.locals.currentUser._id)) {
            req.flash("error", "You are not the author of this review");

            res.redirect(`/listings/${id}`);
        } else {
            next();
        }
    }),

    loginThroughLocalPassport : 
        passport.authenticate("local",{
            failureFlash : true, 
            failureRedirect:"/login",
        }),
   
};
