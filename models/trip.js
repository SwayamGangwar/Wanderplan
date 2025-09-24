const mongoose = require ("mongoose");

const tripSchema = new mongoose.Schema ({
    destination: {
        type: String,
        required: true,
    },

    startDate: {
        type: Date,
        required: true,
    },

    endDate: {
        type: Date,
        required: true,
    },

    coverImageURL: {
        type: String,
        default: "/Images/default_CoverImage",
    },

    budget: {
        type: Number,
        required: true,
    },

    notes: {
        type: String,
    },

    privacy: {
        type: String,
        enum: ["PUBLIC", "PRIVATE"],
        default: "PRIVATE",
        required: true,
    },

    caption: {
        type: String,
        required: false,
        default: "Every Trip is a Holiday to Remember",
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },

    tags: {
        type: [String],
        default: [],
    },

    status: {
        type: String,
        enum: ["Completed","Upcoming"],
        default: "Upcoming",
    },
},
 {timestamps: true},
);

const Trip = mongoose.model("trip", tripSchema);

module.exports = Trip;