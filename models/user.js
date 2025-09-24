const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const {createTokenForUser} = require("../services/authentication")

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    }, 

    password: {
        type: String,
        required: true,
    },

    profileImageURL: {
        type: String,
        default: "/Images/default.png",
    }, 
    
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER",
    },

    location: {
        type: String,
        required: false,
        default: "India"
    },

    bio: {
        type: String,
        required: false,
        default: "Write about yourself",
    },
},
    {timestamps: true},
);

//Hash password before saving
userSchema.pre("save", async function (next) { 
    const user = this;
    if (!user.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10); //This will generate salt internally of (10) Rounds
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
});

//Static method for login
userSchema.statics.matchPasswordAndGenerateToken = async function (email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;
}

const User = model("user", userSchema);

module.exports = User;
