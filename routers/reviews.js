const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controller/review.js")
const wrapAsync = require("../utils/wrapAsync.js");
const { 
        isLoggedIn, 
        validateReview, 
        isReviewAuthor 
    } = 
    require("../middlewares.js");

router.route("/")

    // Route: Create a new review for a listing
    .post(
        isLoggedIn, 
        validateReview, 
        wrapAsync(reviewController.createReview)
    );


router.route("/:reviewID")

    // Route: Delete a review from a listing
    .delete(
        isLoggedIn,
        isReviewAuthor,
        wrapAsync(reviewController.deleteReview)
    );

module.exports = router;
