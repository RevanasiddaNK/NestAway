const express = require("express");

const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/User.js");

module.exports = {
    RenderSignUpForm : (req, res) => {
        res.render("user/signUpForm.ejs");
    },

    SignUpHandler : async (req, res, next) => {
        try {
            const { newUser } = req.body;
            const Nuser = new User({
                email: newUser.email,
                username: newUser.username,
            });

            const registeredUser = await User.register(Nuser, newUser.password);

            // Login after signup
            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", `Hello ${newUser.username}, You are registered!`);
                return res.redirect("/listings");
            });
        } catch (err) {
            req.flash("error", err.message);
            return res.redirect("/signUp");
        }
    },

    RenderLoginForm : (req, res) => {
        res.render("user/loginForm.ejs");
    },

    LoginHandler : (req, res) => {

        try{
            req.flash("success", `Welcome back ${req.user.username} to NestAway!`);
            const redirectURL = res.locals.redirectURL || '/listings';
            //console.log(redirectURL);
            res.redirect(redirectURL);
        }
        catch(err){
            throw new ExpressError(err.message);
        }
    },

    LogoutHandler : (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You are logged out!");
            return res.redirect("/login");
        });
    }
}