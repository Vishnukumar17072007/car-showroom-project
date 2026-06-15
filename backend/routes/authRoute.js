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
const upload = require("../middleware/upload");
const { uploadPhoto } = require("../controllers/photoController");

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
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${(process.env.CLIENT_URL || "").replace(/\/$/, "")}/login`,
  }),
  async (req, res) => {
    const token = generateToken(req.user);
    const clientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");
    const redirectUrl =
      process.env.NODE_ENV === "production"
        ? `${clientUrl}/?token=${token}`       // ← redirect to root with token
        : `http://localhost:1200/?token=${token}`;

    res.redirect(redirectUrl);
  }
);

router.post("/upload-photo", verifyToken, upload.single("photo"), asyncHandler(uploadPhoto));

module.exports = router;
