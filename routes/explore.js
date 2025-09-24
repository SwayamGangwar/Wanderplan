const express = require ("express");
const Trip = require ("../models/trip");
const moment = require ("moment");

const router = express.Router();
router.get("/explore", async (req, res) => {

    try {
        const searchQuery = req.query.search || "";
        const tagFilter = req.query.tag || ""; // tag selected by user

        let query = { privacy: "PUBLIC" }; // always only public trips

        // Add search
        if (searchQuery) {
            query.$or = [
                { destination: { $regex: searchQuery, $options: "i" } },
                { notes: { $regex: searchQuery, $options: "i" } },
                { tags: { $regex: searchQuery, $options: "i" } }
            ];
        }

        // Add tag filter
        if (tagFilter && tagFilter !== "All") {
            query.tags = { $regex: tagFilter, $options: "i" }; 
        }

        const trips = await Trip.find(query).populate("createdBy","fullName");

        const totalTrips = await Trip.countDocuments({privacy: "PUBLIC"});

        res.render("explore", {
            trips,
            searchQuery,
            tagFilter,
            totalTrips,
            moment,
            activePage: "explore",
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});



module.exports = router;