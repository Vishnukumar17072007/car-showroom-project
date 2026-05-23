const Wishlist = require("../models/WishListSchema");

const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({
    userId: req.user.userId,
  }).populate("items.carId");
  res.status(200).json(wishlist || { items: [] });
};

const addToWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ userId: req.user.userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId: req.user.userId, items: [] });
  }
  const exists = wishlist.items.some(
    (item) => item.carId.toString() === req.body.car,
  );
  if (!exists) {
    wishlist.items.push({ carId: req.body.car });
  }
  await wishlist.save();
  res.status(200).json({ message: "Added to wishlist", wishlist });
};

const removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user.userId });
  if (!wishlist) {
    const error = new Error("Wishlist not found");
    error.status = 404;
    throw error;
  }
  wishlist.items = wishlist.items.filter((item) => item.carId.toString() !== req.params.id);
  await wishlist.save();
  res.status(200).json({message: "Removed from wishlist"});
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist};