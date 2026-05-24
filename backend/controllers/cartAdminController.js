const Cart = require("../models/CartListSchema");

const clearCart = async (req, res) => {
  const cart = await Cart.findOne({
    userId: req.user.userId
  });

  if (!cart) {
    const error = new Error("Cart not found");
    error.status = 404;
    throw error;
  }

  cart.items = [];

  await cart.save();

  res.status(200).json({
    message: "Cart cleared"
  });
};

module.exports = { clearCart };