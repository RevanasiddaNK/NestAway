// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const passportLocalStrategy = require("passport-local");
const favicon = require('serve-favicon');

// Import custom modules
const listingsRouter = require("./routers/listings.js");
const reviewsRouter = require("./routers/reviews.js");
const userRouter = require("./routers/user.js");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const User = require("./models/User.js");

// Initialize the Express app
const app = express();

// Serve favicon
const faviconPath = './assets/images/favicon.png';
app.use(favicon(faviconPath));

// Set up EJS engine with ejsMate
app.engine("ejs", ejsMate);
app.set('views', path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Session configuration
const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'defaultsecret', // Use environment variable for secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }
};

// Middleware setup
app.set('trust proxy', 1); // Trust first proxy
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Global middleware for flash messages and user
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errMsg = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Define routes
app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// Redirect root to listings
app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// MongoDB connection setup
const MongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1/NestAwayAppDataBase'; // Use environment variable for MongoDB URL

mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl, MongooseOptions)
    .then(() => console.log("Connection successful"))
    .catch(err => console.log(`Error Occurred: ${err}`));

// Start the server
const port = process.env.PORT || 8080; // Use environment variable for port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Deployment




// Global error-handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.errorMessage || 'Internal Server Error';
    res.status(statusCode).render("includes/error.ejs", { statusCode, errMsg: errorMessage });
});
