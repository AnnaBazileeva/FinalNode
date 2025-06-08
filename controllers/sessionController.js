const parseVErr = require("../utils/parseValidationErrs");

const User = require("../models/User");

const logonShow = (req, res) => {
    res.render("logon");
};

const registerShow = (req, res) => {
    res.render("register", { errors: req.flash("error") });

};

const registerDo = async (req, res, next) => {

    if (req.body.password !== req.body.password1) {
        req.flash("error", "The passwords entered do not match.");
        return res.render("register", { errors: req.flash("error") });
    }
    try {
        await User.create(req.body);
    } catch (e) {
        if (e.constructor.name === "ValidationError") {
            parseVErr(e, req);
        } else if (e.name === "MongoServerError" && e.code === 11000) {
            req.flash("error", "That email address is already registered.");
        } else {
            return next(e);
        }
        return res.render("register", { errors: req.flash("error") });
    }
    req.flash("info", "Registration successful.");
    res.redirect("/");
};

const logoff = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};

module.exports = {
    logonShow,
    registerShow,
    registerDo,
    logoff,
};