const Wishlist = require("../models/WishlistSchema");

const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.userId }).populate("cars");
  res.status(200).json( wishlist || { cars: [] } );
};

const addToWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.userId });
  if (!wishlist) {
    wishlist = new Wishlist({user: req.user.userId, cars: [] });
  }
  const exists = wishlist.cars.some((car) => car.toString() === req.body.car);
  if (!exists) {
    wishlist.cars.push(req.body.car);
  }
  await wishlist.save();
  res.status(200).json({ message: "Added to wishlist", wishlist });
};

const removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.userId });
  if (!wishlist) {
    const error = new Error("Wishlist not found");
    error.status = 404;
    throw error;
  }
  wishlist.cars = wishlist.cars.filter((car) => car.toString() !== req.params.id);
  await wishlist.save();
  res.status(200).json({message: "Removed from wishlist"});
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };