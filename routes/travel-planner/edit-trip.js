const express = require("express");
const Trip = require("../../models/trip");
const { isAuthenticated } = require("../../middlewares/authentication");
const upload = require("../../middlewares/upload");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// GET edit page
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

// POST update trip
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

    // If new image uploaded
    if (req.file) {
      // Delete old image if exists
      if (trip.coverImagePublicId) {
        await cloudinary.uploader.destroy(trip.coverImagePublicId);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Wanderplan",
      });

      updateData.coverImageURL = result.secure_url;
      updateData.coverImagePublicId = result.public_id; // save public_id for deletion next time
    }

    // Format tags
    if (updateData.tags) {
      updateData.tags = updateData.tags.split(",").map((t) => t.trim());
    }

    await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.redirect("/travel-planner");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating trip");
  }
});

module.exports = router;
