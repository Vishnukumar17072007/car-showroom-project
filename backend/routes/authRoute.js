const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/UserSchema");
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

const isProd = process.env.NODE_ENV === 'production';
const BCRYPT_ROUNDS = 12;

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
};

router.post("/register", async (req, res) => {
    try {
        const { userName, email, password, phone } = req.body;

        if (!userName?.trim() || !email?.trim() || !password || !phone?.trim()) {
            return res.status(400).json({ message: "All fields are required." });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const isUserExists = await User.findOne({ email: normalizedEmail });
        if (isUserExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

        const user = new User({
            userName: userName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: phone.trim(),
            role: "user",
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email or phone already in use." });
        }
        console.error("Register error:", err);
        res.status(500).json({ message: "Registration failed" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            message: "Login successfully",
            user: {
                userId: user._id,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed" });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: "Account logged out successfully." });
});

router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            userId: user._id,
            userName: user.userName,
            email: user.email,
            phone: user.phone,
            location: user.location,
            role: user.role,
            subscription: user.subscription,
            createdAt: user.createdAt,
        });
    } catch (err) {
        console.error("Me error:", err);
        res.status(500).json({ message: "Failed to load profile" });
    }
});

router.put("/update", verifyToken, async (req, res) => {
    const { userName, phone, address, city, state, pincode, currentPassword, newPassword } = req.body;

    if (!userName || !phone || !address || !city || !state || !pincode) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.userName = userName.trim();
        user.phone = phone.trim();
        user.location.address = address.trim();
        user.location.city = city.trim();
        user.location.state = state.trim();
        user.location.pincode = Number(pincode);

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect." });
            }
            if (newPassword.length < 8) {
                return res.status(400).json({ message: "New password must be at least 8 characters." });
            }
            user.password = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                phone: user.phone,
                location: user.location,
                role: user.role,
                subscription: user.subscription,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "This phone number is already in use." });
        }
        console.error("Update profile error:", err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

module.exports = router;
