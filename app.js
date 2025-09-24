require("dotenv").config();
const express = require ("express");
const mongoose = require ("mongoose");
const cookieParser = require ("cookie-parser");
const path = require ("path");

const homeRoute = require ("./routes/home")
const userRoute = require ("./routes/user");
const exploreTrips = require ("./routes/explore");
const userProfile = require ("./routes/profile");
const travelPlannerRoute = require ("./routes/travel-planner/travel-planner");
const addTripRoute = require ("./routes/travel-planner/add-trip");
const editTripRoute = require("./routes/travel-planner/edit-trip");
const deleteTripRoute = require ("./routes/travel-planner/delete-trip");

const app = express();
const PORT = process.env.PORT || 8000;

//Database Connection (MongoDB)
const connectDB = async () => {  
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected!");
    } catch (err) {
        console.error("Error connecting mongodb");
    }
};

connectDB();

//seting view engine - ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('public'));

//Routes
app.use("/", homeRoute);
app.use("/user", userRoute);
app.use("/trips", exploreTrips);
app.use("/profile", userProfile);
app.use("/travel-planner", travelPlannerRoute);
app.use("/trips", addTripRoute);
app.use("/trips", editTripRoute);
app.use("/trips", deleteTripRoute);

app.listen(PORT, console.log(`Server Started on PORT: ${PORT}`));