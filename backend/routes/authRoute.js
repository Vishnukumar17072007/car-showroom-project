const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/userSchema");
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

//Register
router.post("/register", async( req, res)=>{
    try{
        const {userName, email, password, role} = req.body;

        const isUserExists = await User.findOne({email});
        if(isUserExists){
            return res.status(400).json({message: "User already Exits"});
        }

        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            userName,
            email,
            password: hashedPassword,
            role
        })

        await user.save();

        res.status(201).json({message: "User Registered successfully"});
    }
    catch(err){
        res.status(500).json({message: err.message});   
    }
})

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
            secure: false,
            sameSite: 'lax',
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
})

router.post('/logout', async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',        // ← must match exactly what was set
    });
    
    res.status(200).json({message: "account logged out successfully."});
})

router.get('/me', verifyToken, async (req, res) => {
    try{
        const user = await User.findById(req.user.userId).select('-password');
        if (!user){
            return res.status(400).json({message: "User not found."});
        }

        res.status(200).json({
            userId: user._id,
            role: user.role
        });
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;