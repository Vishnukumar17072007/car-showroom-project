const bcrypt = require('bcryptjs');
const User = require('../models/UserSchema');
const PendingOtp = require('../models/PendingOtp');
const generateToken = require('../utils/generateToken');
const crypto = require("crypto");
const { sendOtpEmail } = require("../utils/sendEmail.js");

const OTP_TTL_MS = 10 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

const BCRYPT_ROUNDS = 12;

const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
};

/* ── Step 1: "Generate OTP" button hits this — no user created yet ── */
const sendRegistrationOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists." });
    }

    const otp = String(crypto.randomInt(100000, 999999));
    const otpHash = await bcrypt.hash(otp, BCRYPT_ROUNDS);

    await PendingOtp.findOneAndUpdate(
        { email },
        { otpHash, expiresAt: new Date(Date.now() + OTP_TTL_MS) },
        { upsert: true, returnDocument: 'after' }
    );

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to your email." });
};

/* ── Step 2: full signup form submit, OTP included — creates + logs in ── */
const register = async (req, res) => {
    const { userName, email, password, phone, otp } = req.body;

    if (!otp) return res.status(400).json({ message: "Please enter the OTP sent to your email." });

    const pending = await PendingOtp.findOne({ email });
    if (!pending || pending.expiresAt < new Date()) {
        return res.status(400).json({ message: "OTP expired or not requested. Click 'Generate OTP' again." });
    }

    const validOtp = await bcrypt.compare(otp, pending.otpHash);
    if (!validOtp) {
        return res.status(400).json({ message: "Incorrect OTP." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await User.create({
        userName,
        email,
        password: hashedPassword,
        phone,
        role: "user",
        isEmailVerified: true, // OTP already proved ownership
    });

    await PendingOtp.deleteOne({ email });

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ token, message: "Account created." });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials." });

    if (!user.isEmailVerified) {
        return res.status(403).json({
            message: "Please verify your email before signing in.",
            code: "EMAIL_NOT_VERIFIED",
        });
    }

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);
    res.status(200).json({ token });
};

const logout = async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

/* ─── Forgot password (OTP flow) — unchanged, unrelated to registration ─── */

const requestPasswordOtp = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Always respond 200 even if not found — don't leak which emails exist
    if (!user) return res.status(200).json({ message: "If that email exists, a code has been sent." });

    const otp = String(crypto.randomInt(100000, 999999));
    user.resetOtp = await bcrypt.hash(otp, BCRYPT_ROUNDS);
    user.resetOtpExpires = new Date(Date.now() + OTP_TTL_MS);
    user.resetTokenHash = undefined;
    await user.save();

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "If that email exists, a code has been sent." });
};

const verifyPasswordOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select("+resetOtp +resetOtpExpires");
    if (!user || !user.resetOtp || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const valid = await bcrypt.compare(otp, user.resetOtp);
    if (!valid) return res.status(400).json({ message: "Invalid or expired OTP." });

    // OTP consumed — issue a short-lived reset token for the final step
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.status(200).json({ token: resetToken });
};

const resetPassword = async (req, res) => {
    const { email, token, newPassword } = req.body;
    const tokenHash = crypto.createHash("sha256").update(token || "").digest("hex");

    const user = await User.findOne({ email }).select("+resetTokenHash +resetTokenExpires +password");
    if (!user || user.resetTokenHash !== tokenHash || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
        return res.status(400).json({ message: "Reset session expired. Start again." });
    }

    user.password = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    user.resetTokenHash = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated." });
};

module.exports = {
    register,
    login,
    logout,
    sendRegistrationOtp,
    requestPasswordOtp,
    verifyPasswordOtp,
    resetPassword,
};