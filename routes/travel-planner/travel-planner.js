const express = require ("express");
const Trip = require("../../models/trip");
const {isAuthenticated} = require ("../../middlewares/authentication");
const moment = require ("moment")

const router = express.Router();

router.get("/", isAuthenticated, async (req,res)=>{
    const trips = await Trip.find({createdBy: req.user._id});
    const totalTrips = await Trip.countDocuments({createdBy: req.user._id});
    const upcomingTrips = await Trip.countDocuments({createdBy: req.user._id, status: "Upcoming"});
    const completedTrips = await Trip.countDocuments({createdBy: req.user._id, status: "Completed"});

    res.render("travel-planner",{
        user: req.user,
        trips,
        totalTrips,
        upcomingTrips,
        completedTrips,
        moment,
        activePage: "planner",
    });
});

module.exports = router;