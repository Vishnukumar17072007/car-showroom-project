const Cart = require("../models/CartListSchema");

const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.carId").lean();

  res.status(200).json(cart || { items: [] });
};

const addToCart = async (req, res) => {
  const { carId } = req.body;

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user.userId },
    {
      $addToSet: {
        items: { carId },
      },
    },
    {
      upsert: true,
      new: true,
    },
  );

  res.status(200).json({
    message: "Added to cart",
    cart,
  });
};

const removeFromCart = async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    {
      userId: req.user.userId,
    },
    {
      $pull: {
        items: {
          carId: req.params.id,
        },
      },
    },
    {
      new: true,
    },
  );

  if (!cart) {
    const error = new Error("Cart not found");
    error.status = 404;
    throw error;
  }

  res.status(200).json({
    message: "Removed from cart",
    cart,
  });
};

module.exports = { getCart, addToCart, removeFromCart} ;