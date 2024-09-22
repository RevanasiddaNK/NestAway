const express = require("express");
const router = express.Router({ mergeParams: true });
const userController = require("../controller/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const {  
     saveRedirectURL, 
     loginThroughLocalPassport, 
    } = 
    require("../middlewares.js");

router.route("/signUp")

    // Route: Render Sign Up Form
    .get(userController.RenderSignUpForm)

    // Route: Handle Sign Up Logic
    .post(
        wrapAsync(userController.SignUpHandler)
    );
    

router.route("/login")

    // Route: Render Login Form
    .get( userController.RenderLoginForm)

    // Route: Handle Login Logic
    .post(
        saveRedirectURL, 
        loginThroughLocalPassport, 
        userController.LoginHandler
    );


router.route("/logout")

    // Route: Handle Logout Logic
    .get(
        userController.LogoutHandler
    );

module.exports = router;
