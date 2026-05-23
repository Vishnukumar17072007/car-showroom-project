const bcrypt = require('bcryptjs');
const User = require('../models/UserSchema');
const generateToken = require('../utils/generateToken');

const BCRYPT_ROUNDS = 12;

const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 1000*60*60*24*7
};

const register= async(req,res)=>{
    const { userName, email, password, phone }=req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({email: normalizedEmail});

    if(existingUser){
        const error = new Error("User already exists");
        error.status=400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash( password, BCRYPT_ROUNDS );

    const user = new User({
        userName: userName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone.trim(),
        role:"user"
    });


    await user.save();
    res.status(201).json({ message: "User registered successfully" });

};

const login= async(req,res)=>{
    
    const { email, password }=req.body;
    const user= await User.findOne({ email: email.trim().toLowerCase()});

    if( !user || !(await bcrypt.compare( password, user.password ))){
        const error= new Error("Invalid credentials");
        error.status=400;
        throw error;
    }

    const token= generateToken(user);

    res.cookie( "token", token, cookieOptions );

    res.status(200).json({
        message:"Login successful",
        user:{ userId: user._id, role: user.role }
    });
};

module.exports={ register, login };