const Order = require("../models/OrderSchema");

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    const error = new Error("Order not found");

    error.status = 404;

    throw error;
  }

  // User cancel route
  const isUserCancel = req.route.path === "/cancel/:id";

  if (isUserCancel) {
    order.status = "cancelled";
  } else {
    order.status = req.body.status;
  }

  await order.save();

  res.status(200).json({ message: "Order updated", order });
};

//delte
const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if(!order) {
    const error = new Error("Order not found!");
    error.status = 404;
    throw error;
  }

  res.status(200).json({message: "Order was Successfully deleted from DB"});
}

const softDeleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  // Allow deleting only cancelled orders
  if (order.status !== "cancelled") {
    const error = new Error(
      "Only cancelled orders can be removed from history",
    );

    error.status = 400;
    throw error;
  }

  // Already deleted check
  if (order.deletedByUser) {
    const error = new Error("Order already removed from history");

    error.status = 400;
    throw error;
  }

  order.deletedByUser = true;
  order.deletedAt = new Date();

  await order.save();

  res.status(200).json({
    message: "Order removed from history",
  });
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


module.exports = {
  updateOrderStatus,
  deleteOrder,
  softDeleteOrder,
  getAllOrders
};
