const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true,
        unique: true
    },
    image: {
        type: String,
        default: ""
    },
    location: {
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
    },
    role: {
        type: String,
        enum: ["user","admin"],
        default: "user"
    },
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free"
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema, "UserDetails")