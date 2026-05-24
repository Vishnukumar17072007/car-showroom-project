const Order = require("../models/OrderSchema");
const Cart = require("../models/CartListSchema");
const Car = require("../models/CarSchema");

const createOrder = async (req, res) => {
  const { carIds, shippingDetails } = req.body;

  const cars = await Car.find({
    _id: {
      $in: carIds,
    },
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
  })

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

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
};
