const Order = require("../models/OrderSchema");
const Cart = require("../models/CartListSchema");
const Car = require("../models/CarSchema");
const Notification = require("../models/NotificationSchema");
const { saveNotification } = require('./notificationController')
const { default: mongoose } = require("mongoose");

const createOrder = async (req, res) => {
  const { carId, shippingDetails } = req.body;

  const cars = await Car.find({
    _id: carId,
    available: {
      $gt: 0
    }
  });

  if (!cars.length) {
    const error = new Error("No cars found");
    error.status = 404;
    throw error;
  }

  const items = cars.map((car) => ({
    carId: car._id,
    image: car.image,
    carName: car.carName,
  }));

  const price = cars.reduce((sum, car) => sum + car.price, 0);

  const order = new Order({
    userId: req.user.userId,
    items,
    price,
    shippingDetails,
  });

  await order.save();
  await Car.updateMany({_id: carId },{$inc: {available: -1}});
  await Cart.updateOne(
    {
      userId: req.user.userId,
    },
    {
      $pull: {
        items: {
          carId: carId,
        },
      },
    },
  );

  // ✅ Create notification for user
  await saveNotification({
    user: order.userId,
    image: order.items[0].image,
    title: "Order Placed",
    message: `Your journey with the ${order.items[0].carName} begins now. Thank you for trusting CarField — we'll notify you as your order progresses.`,
  });
  
  res.status(201).json({ message: "Order created", order });
};

const getOrders = async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const filter = isAdmin ? {} : {userId: new mongoose.Types.ObjectId(req.user.userId), deletedByUser: false,};
  const orders = await Order.find({
    ...filter,
  })
  .populate("userId", "userName email")
  .populate("items.carId")
  .sort({createdAt: -1});

  res.status(200).json(orders);
};

const softDeleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  // Allow deleting only cancelled orders
  if ((order.status !== "cancelled") && (order.status !== "rejected")) {
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

  const statusMessages = {
    pending: `Your order for the ${order.items[0].carName} has been placed and is now pending review. We'll update you shortly!`,
    in_progress: `Good news! Your order for the ${order.items[0].carName} is now being processed. Hang tight, we're working on it.`,
    approved: `Your order for the ${order.items[0].carName} has been approved! We're getting it ready for delivery.`,
    delivered: `Your ${order.items[0].carName} has been delivered! Thank you for choosing CarField — we hope you love it.`,
    rejected: `Unfortunately, your order for the ${order.items[0].carName} could not be approved. Please reach out to us for more details.`,
    cancelled: `Your order for the ${order.items[0].carName} has been cancelled. If this wasn't intentional, feel free to contact us anytime.`,
  };
  
  const message = statusMessages[order.status] 
    || `Your order for "${order.items[0].carName}" has been updated to "${order.status}".`;

  await saveNotification({
    user: order.userId,
    image: order.items[0].image,
    title: "Order Improvement",
    message: message,
  });

  res.status(200).json({ message: "Order updated", order });
};

//delete from DB
const deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if(!order) {
    const error = new Error("Order not found!");
    error.status = 404;
    throw error;
  }

  res.status(200).json({message: "Order was Successfully deleted from DB"});
}

module.exports = { createOrder, getOrders, softDeleteOrder, updateOrderStatus, deleteOrder };