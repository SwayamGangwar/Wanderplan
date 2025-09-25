const express = require("express");
const Trip = require("../../models/trip");
const { isAuthenticated } = require("../../middlewares/authentication");
const upload = require("../../middlewares/upload");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

router.get("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).lean();

    if (!trip) {
      return res.status(404).send("Trip not found");
    }

    const formattedTrip = {
      ...trip,
      startDateFormatted: trip.startDate
        ? new Date(trip.startDate).toLocaleDateString("en-GB").replace(/\//g, "-")
        : "",
      endDateFormatted: trip.endDate
        ? new Date(trip.endDate).toLocaleDateString("en-GB").replace(/\//g, "-")
        : "",
    };

    res.render("edit-trip", {
      trip: formattedTrip,
      activePage: "planner",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching trip details");
  }
});

router.post("/edit/:id", isAuthenticated, upload.single("coverImageURL"), async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Invalid user" });
    }

    const updateData = { ...req.body };

    // Handle image update for Cloudinary
    if (req.file) {
      // Delete old image from Cloudinary if it's not the default one
      if (trip.coverImageURL && !trip.coverImageURL.includes("default_CoverImage.png.png")) {
        // Extract the public ID from the Cloudinary URL
        const publicId = trip.coverImageURL.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`Wanderplan/${publicId}`);
      }

      // Upload the new image and get its URL
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Wanderplan",
      });
      updateData.coverImageURL = result.secure_url;
      // Multer-storage-cloudinary should handle temp file deletion, but if not, use fs.unlinkSync(req.file.path);
    }
    
    // Check for tags and format them
    if (updateData.tags) {
        updateData.tags = updateData.tags.split(",").map(t => t.trim());
    }

    await Trip.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true, runValidators: true });

    res.redirect("/travel-planner");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating trip");
  }
});

module.exports = router;