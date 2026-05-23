const User = require("../models/UserSchema");
const Car = require("../models/CarSchema");
const Order = require("../models/OrderSchema");

const getDashboardStats = async (req, res) => {
  const [totalUsers, totalCars, totalOrders, orders] = await Promise.all([
    User.countDocuments(),
    Car.countDocuments({
      isDeleted: false,
    }),
    Order.countDocuments(),
    Order.find(),
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  res.status(200).json({totalUsers, totalCars, totalOrders, totalRevenue });
};

const getRecentOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "userName email" )
    .populate("car")
    .sort({
      createdAt: -1,
    })
    .limit(10);
  res.status(200).json(orders);
};

module.exports = { getDashboardStats, getRecentOrders };