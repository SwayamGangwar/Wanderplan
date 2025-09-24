const express = require("express");
const Trip  = require("../../models/trip");
const {isAuthenticated} = require ("../../middlewares/authentication");
const upload = require ("../../middlewares/upload");
const path = require ("path");
const fs = require ("fs");

const router = express.Router();

router.get("/edit/:id", isAuthenticated, async (req,res)=>{
    const trip = await Trip.findById(req.params.id).lean();
    
    const formattedTrip = {
        ...trip,
        startDateFormatted: trip.startDate
            ? new Date(trip.startDate)
                  .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                  .replace(/\//g, "-")
            : "",
        endDateFormatted: trip.endDate
            ? new Date(trip.endDate)
                  .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                  .replace(/\//g, "-")
            : "",
    };

    res.render("edit-trip",{
        trip: formattedTrip,
        activePage: "planner" 
    });
});


router.post(
  "/edit/:id",
  isAuthenticated,
  upload.single("coverImage"), // field name in form
  async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // check user ownership
      if (trip.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Invalid user" });
      }

      // build update object
      const updateData = { ...req.body };

      // if new file uploaded, update image & delete old one
      if (req.file) {
        // delete old image if it's not default
        if (trip.coverImageURL && !trip.coverImageURL.includes("default_CoverImage")) {
          const oldPath = path.join(__dirname, "../../public", trip.coverImageURL);
          fs.unlink(oldPath, (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }
        updateData.coverImageURL = "/uploads/" + req.file.filename;
      }

      await Trip.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true, runValidators: true });

      res.redirect("/travel-planner");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating trip");
    }
  }
);

module.exports = router;