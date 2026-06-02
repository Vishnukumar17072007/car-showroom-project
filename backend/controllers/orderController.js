const Order = require("../models/OrderSchema");
const Cart = require("../models/CartListSchema");
const Car = require("../models/CarSchema");

const createOrder = async (req, res) => {
  const { carIds, shippingDetails } = req.body;

  const cars = await Car.find({
    _id: {
      $in: carIds
    },
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

    priceAtPurchase: car.price,

    carName: car.carName,
  }));

  const totalPrice = cars.reduce(
    (sum, car) => sum + car.price,

    0,
  );

  const order = new Order({
    userId: req.user.userId,

    items,

    totalPrice,

    shippingDetails,
  });

  await order.save();

  await Car.updateMany({_id: { $in: carIds }},{$inc: {available: -1}});

  await Cart.updateOne(
    {
      userId: req.user.userId,
    },

    {
      $pull: {
        items: {
          carId: {
            $in: carIds,
          },
        },
      },
    },
  );

  res.status(201).json({
    message: "Order created",

    order,
  });
};

const getUserOrders = async (req, res) => {
  const orders = await Order.find({
    userId: req.user.userId,
    deletedByUser: false,
  })
  .populate("items.carId")
  .sort({
    createdAt: -1,
  });
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

module.exports = {
  createOrder,
  getUserOrders,
  softDeleteOrder,
};
