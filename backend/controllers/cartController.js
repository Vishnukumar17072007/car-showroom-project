const Cart = require("../models/CartSchema");

const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.userId }).populate(
    "cars.car",
  );

  res.status(200).json(cart || { cars: [] });
};

const addToCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.userId });

  if (!cart) {
    cart = new Cart({ user: req.user.userId, cars: [] });
  }

  cart.cars.push({ car: req.body.car, quantity: req.body.quantity || 1 });

  await cart.save();

  res.status(200).json({
    message: "Added to cart",

    cart,
  });
};

const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({
    user: req.user.userId,
  });

  if (!cart) {
    const error = new Error("Cart not found");

    error.status = 404;

    throw error;
  }

  cart.cars = cart.cars.filter((item) => item.car.toString() !== req.params.id);

  await cart.save();

  res.status(200).json({
    message: "Removed from cart",
  });
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
};
