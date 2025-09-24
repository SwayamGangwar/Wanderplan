const express = require ("express");
const User = require("../models/user");
const {validateToken} = require("../services/authentication");
const {isAuthenticated} = require ("../middlewares/authentication");
const upload = require ("../middlewares/upload");
const path = require("path");
const fs = require("fs");


const router = express.Router();

router.get("/me", isAuthenticated, async (req,res)=>{

    const joinedDate = req.user.createdAt
    ?req.user.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"   
        })
      : "Unknown";

    res.render("profile", {
        user: req.user, //user from middleware
        joinedDate,
        activePage: "profile"
    });
});

router.post("/edit", isAuthenticated, upload.single("profileImageURL"), async (req,res)=>{
   
    const user = await User.findById(req.user._id);
    if(!user){
        return res.status(404).json({message: "User not found"});
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id,
        {$set: req.body},
        { new: true, runValidators: true }
    );

    res.redirect("/profile/me");
});

router.get("/logout", isAuthenticated, (req,res)=>{
    res.clearCookie("token").redirect("/");
});

module.exports = router;