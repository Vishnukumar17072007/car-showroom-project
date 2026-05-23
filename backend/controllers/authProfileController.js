const User = require("../models/UserSchema");

const logout = async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
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
};

module.exports = {
  logout,
  getMe,
};
