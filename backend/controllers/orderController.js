const Order = require("../models/OrderSchema");

const createOrder = async (req, res) => {
  const order = new Order({ ...req.body, user: req.user.userId });
  await order.save();
  res.status(201).json({ message: "Order created", order });
};
const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })
    .populate("car")
    .sort({ createdAt: -1 });
  res.status(200).json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("car")
    .populate("user", "userName email")
    .sort({ createdAt: -1 });
  res.status(200).json(orders);
};

module.exports = { createOrder, getUserOrders, getAllOrders };
