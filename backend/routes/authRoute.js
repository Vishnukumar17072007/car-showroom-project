const express = require("express");
const passport = require("passport");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const asyncHandler = require("../utils/asyncHandler");
const validateRequest = require("../middleware/validationMiddleware");
const {registerValidation, loginValidation} = require("../validations/authValidation");
const { register, login, logout, sendRegistrationOtp, requestPasswordOtp, verifyPasswordOtp, resetPassword } = require("../controllers/authController");
const generateToken = require("../utils/generateToken");

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
};

router.post("/send-registration-otp", asyncHandler(sendRegistrationOtp));

router.post("/register", registerValidation, validateRequest, asyncHandler(register));

router.post("/login", loginValidation, validateRequest, asyncHandler(login));

router.post("/logout", verifyToken, asyncHandler(logout));

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${(process.env.CLIENT_URL || "").replace(/\/$/, "")}/login`,
  }),
  async (req, res, next) => {
    try {
      const token = generateToken(req.user);
      const clientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");
      const redirectUrl =
        process.env.NODE_ENV === "production"
          ? `${clientUrl}/?token=${token}`
          : `http://localhost:1200/?token=${token}`;
      res.redirect(redirectUrl);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/forgot-password", asyncHandler(requestPasswordOtp));

router.post("/verify-otp", asyncHandler(verifyPasswordOtp));

router.post("/reset-password", asyncHandler(resetPassword));

module.exports = router;