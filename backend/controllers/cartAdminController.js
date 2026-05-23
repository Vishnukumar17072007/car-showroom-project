const Cart = require("../models/CartListSchema");

const clearCart = async (req, res) => {
  const cart = await Cart.findOne({user: req.user.userId});
  if (!cart) {
    const error = new Error("Cart not found");
    error.status = 404;
    throw error;
  }
  cart.cars = [];
  await cart.save();
  res.status(200).json({ message: "Cart cleared" });
};

const updateQuantity = async (req, res) => {
  const cart = await Cart.findOne({user: req.user.userId});
  if (!cart) {
    const error = new Error("Cart not found");
    error.status = 404;
    throw error;
  }
  const item = cart.cars.find((item) => item.car.toString() === req.params.id);
  if (!item) {
    const error = new Error("Item not found");
    error.status = 404;
    throw error;
  }
  item.quantity = req.body.quantity;
  await cart.save();
  res.status(200).json({message: "Quantity updated", cart });
};

module.exports = {clearCart, updateQuantity};