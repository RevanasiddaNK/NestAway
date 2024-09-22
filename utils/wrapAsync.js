const ExpressError = require("./ExpressError");

module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((err) => {
            next(new ExpressError(500, err.message));
        });
    };
};
