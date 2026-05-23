const Order = require("../models/OrderSchema");

const createOrder = async (req, res) => {
  const order = new Order({ ...req.body, userId: req.user.userId});
  await order.save();
  res.status(201).json({ message: "Order created", order });
};

const getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId })
    .populate("items.carId")
    .sort({
      createdAt: -1,
    });
  res.status(200).json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "userName email")
    .populate("items.carId")
    .sort({
      createdAt: -1,
    });
  res.status(200).json(orders);
};

module.exports = { createOrder, getUserOrders, getAllOrders};