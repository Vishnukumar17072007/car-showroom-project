const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");

const BCRYPT_ROUNDS = 12;

const updateProfile = async (req, res) => {
  const { email, googleId, userName, phone, address, city, state, pincode, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.userId);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  user.userName = userName.trim();
  user.phone = phone.replace(/\s+/g,'');
  user.location.address = address.trim();
  user.location.city = city.trim();
  user.location.state = state.trim();
  user.location.pincode = Number(pincode);

  if(email && !googleId) {
    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        const error = new Error("Current password incorrect");
        error.status = 400;
        throw error;
      }
  
      user.password = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    }
  }

  await user.save();

  res.status(200).json({ message: "Profile updated", user });
};

module.exports = { updateProfile };