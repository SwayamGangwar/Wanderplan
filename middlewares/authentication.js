const express = require ("express");
const {validateToken} = require ("../services/authentication");
const User = require("../models/user");

async function isAuthenticated (req,res,next) {
    const token = req.cookies.token;
    if(!token) {
        return res.redirect("/user/signup");
    }

    const payload = validateToken(token);
    const user = await User.findById(payload._id);

    if(!user) {
        return res.status(404).json({message: "User not found"});
    }

    req.user = user;
    next();
};

module.exports = {
    isAuthenticated,
};