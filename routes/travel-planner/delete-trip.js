const express = require ("express");
const Trip = require ("../../models/trip");
const {isAuthenticated} = require ("../../middlewares/authentication");

const router = express.Router();

router.post("/delete/:id", isAuthenticated, async (req,res)=>{

    //find the trip
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if(!trip){
        return res.status(404).json({message:"Trip not found"})
    }

    //check the current logged-in user is the creator of the trip
    if(trip.createdBy.toString() !== req.user._id.toString()){
        return res.status(403).json({message: "Invalid user"});
    }

    res.redirect("/travel-planner")
});

module.exports = router;