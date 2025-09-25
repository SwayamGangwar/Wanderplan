const express = require ("express");
const Trip = require ("../../models/trip");
const {isAuthenticated} = require ("../../middlewares/authentication");
const upload = require ("../../middlewares/upload");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");


const router = express.Router();

router.get("/add-new", (req,res)=>{
    res.render("add-trip", {activePage: "planner"});
});

router.post("/add-new", isAuthenticated, upload.single("coverImageURL"), async (req,res)=>{
    try {
        let imageUrl = "/Images/default_CoverImage.png.png"; // default image if no upload
    
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Wanderplan",
          });
          imageUrl = result.secure_url;
          fs.unlinkSync(req.file.path); // delete local temp file
        }
    const {destination, startDate, endDate, coverImageURL, notes, budget, tags, privacy, caption, status, createdBy} = req.body;
    const trip = Trip.create({
        destination,
        startDate,
        endDate,
        coverImageURL: imageUrl,
        notes,
        budget,
        tags: tags ? tags.split(",").map(t => t.trim()) : [],
        privacy,
        status,
        createdBy: req.user._id,
        ...(caption ? { caption } : {})
    });

    return res.redirect("/travel-planner")
    } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});

module.exports = router;