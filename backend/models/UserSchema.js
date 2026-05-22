const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: ""
    },
    location: {
        address: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        pincode: {
            type: Number,
            default: null
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

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema, "UserDetails");
