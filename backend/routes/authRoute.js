const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const asyncHandler = require("../utils/asyncHandler");
const validateRequest = require("../middleware/validationMiddleware");
const {registerValidation, loginValidation} = require("../validations/authValidation");
const { updateProfileValidation } = require("../validations/profileValidation");
const { register, login } = require("../controllers/authController");
const { logout } = require("../controllers/authProfileController");
const { getProfile } = require("../controllers/profileController");
const { updateProfile } = require("../controllers/profileUpdateController");
const passport = require("passport");
const generateToken = require("../utils/generateToken");

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
};

router.post("/register", registerValidation, validateRequest, asyncHandler(register));

router.post("/login", loginValidation, validateRequest, asyncHandler(login));

router.post("/logout", verifyToken, asyncHandler(logout));

router.get("/me", verifyToken, asyncHandler(getProfile));

router.put("/update", verifyToken, updateProfileValidation, validateRequest, asyncHandler(updateProfile));

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google",{session: false,failureRedirect:`${process.env.CLIENT_URL}/login`}),
    async (req, res) => {
      const token = generateToken(req.user);

      res.cookie(
        "token",
        token,
        cookieOptions
      );

      res.redirect(process.env.CLIENT_URL);
    }
);

module.exports = router;
