const express = require ("express");
const Trip = require ("../../models/trip");
const {isAuthenticated} = require ("../../middlewares/authentication");
const upload = require ("../../middlewares/upload");

const router = express.Router();

router.get("/add-new", (req,res)=>{
    res.render("add-trip", {activePage: "planner"});
});

router.post("/add-new", isAuthenticated, upload.single("coverImageURL"), (req,res)=>{
    const {destination, startDate, endDate, coverImageURL, notes, budget, tags, privacy, caption, status, createdBy} = req.body;
    const trip = Trip.create({
        destination,
        startDate,
        endDate,
        coverImageURL: req.file? "/uploads/" + req.file.filename : "/Images/default_CoverImage.png.png",
        notes,
        budget,
        tags: tags ? tags.split(",").map(t => t.trim()) : [],
        privacy,
        status,
        createdBy: req.user._id,
        ...(caption ? { caption } : {})
    });


    return res.redirect("/travel-planner")
});

module.exports = router;