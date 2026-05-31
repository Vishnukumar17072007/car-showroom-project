const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
    },
    googleId: {
       type: String,
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
    },
    image: {
        type: String,
        default: "",
    },
    location: {
        address: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        pincode: {
            type: Number,
            default: "",
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema, "UserDetails");