const express = require ("express");
const User = require ("../models/user");

const router = express.Router();

router.get("/signup", (req,res)=>{
    res.render("signup", {activePage:"signup"});
});

router.get("/login",(req,res)=>{
    res.render("login", {activePage: "login"});
});

router.post("/signup", async (req,res)=>{
    const {fullName ,email ,password} = req.body;
    await User.create({
        fullName,
        email,
        password,
    });

    return res.redirect("/user/login?activePage=login");
});

router.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email,password);

        res.cookie("token", token);
        return res.redirect("/travel-planner?activePage=planner");

    } catch {
        res.render("login", {
            error: "Incorrect Email or Password",
            activePage: "login"});
    }
});

module.exports = router;