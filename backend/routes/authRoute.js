const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/UserSchema");
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

//Register
//Register
router.post("/register", async (req, res) => {
    try {
        const { userName, email, password, role, phone } = req.body; // ← phone added

        const isUserExists = await User.findOne({ email });
        if (isUserExists) {
            return res.status(400).json({ message: "User already Exists" });
        }

        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            userName,
            email,
            password: hashedPassword,
            phone,   // ← phone saved
            role
        });

        await user.save();

        res.status(201).json({ message: "User Registered successfully" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Login
router.post('/login', async(req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "User not found!"});
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign(
            {userId: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000*60*60*24*7
        });

        res.status(200).json({
            message: "Login Successfully!",
            user: {
                userId: user._id,
                role: user.role
            }
        })
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/logout', async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'none',        // ← must match exactly what was set
    });
    
    res.status(200).json({message: "account logged out successfully."});
});

router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        res.status(200).json({
            userId:       user._id,
            userName:     user.userName,
            email:        user.email,
            phone:        user.phone,
            location:     user.location,
            role:         user.role,
            subscription: user.subscription,
            createdAt:    user.createdAt,
        });
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

router.put("/update", verifyToken, async (req, res) => {

    const { userName, phone, address, city, state, pincode, currentPassword, newPassword } = req.body;

    // Basic presence check
    if (!userName || !phone || !address || !city || !state || !pincode) {
        return res.status(400).json({ message: "Every fields are required." });
    }

    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ── Update basic fields ──────────────────────────
        user.userName           = userName.trim();
        user.phone              = phone.trim();
        user.location.address   = address.trim();
        user.location.city      = city.trim();
        user.location.state     = state.trim();
        user.location.pincode   = pincode;

        // ── Update password only if both fields are sent ─
        if (currentPassword && newPassword) {

            // Verify current password is correct
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect." });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({ message: "New password must be at least 8 characters." });
            }

            // Hash and save new password
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        // Return updated user — never send password back
        const updatedUser = {
            _id:          user._id,
            userName:     user.userName,
            email:        user.email,
            phone:        user.phone,
            location:     user.location,
            role:         user.role,
            subscription: user.subscription,
            createdAt:    user.createdAt,
        };

        res.status(200).json({ message: "Profile updated successfully.", user: updatedUser });

    } catch (err) {

        // Phone number is unique — catch duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ message: "This phone number is already in use." });
        }

        console.error("Update profile error:", err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

module.exports = router;