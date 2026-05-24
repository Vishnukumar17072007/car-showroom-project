const Order = require("../models/OrderSchema");

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    const error = new Error("Order not found");

    error.status = 404;

    throw error;
  }

  // User cancel route
  if (req.originalUrl.includes("/cancel/")) {
    order.status = "cancelled";
  }

  // Admin update route
  else {
    order.status = req.body.status;
  }

  await order.save();

  res.status(200).json({
    message: "Order updated",

    order,
  });
};

const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    const error = new Error("Order not found");

    error.status = 404;

    throw error;
  }

  res.status(200).json({
    message: "Order deleted",
  });
};

module.exports = {
  updateOrderStatus,
  deleteOrder,
};
