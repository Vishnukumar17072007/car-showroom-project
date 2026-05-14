const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique: true
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