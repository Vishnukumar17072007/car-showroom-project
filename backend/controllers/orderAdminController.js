const Order = require("../models/OrderSchema");
const { isValidObjectId } = require("../utils/objectId");

const updateOrderStatus = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    const error = new Error("Invalid order id");
    error.status = 400;
    throw error;
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }
  order.status = req.body.status;
  await order.save();
  res.status(200).json({ message: "Order updated", order });
};

const deleteOrder = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    const error = new Error("Invalid order id");
    error.status = 400;
    throw error;
  }
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }
  res.status(200).json({ message: "Order deleted" });
};

module.exports = { updateOrderStatus, deleteOrder};