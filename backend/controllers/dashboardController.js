const WishList = require('../models/WishListSchema');
const CartList = require('../models/CartListSchema');
const Order = require('../models/OrderSchema');
const mongoose = require('mongoose');

const getWishlistCount = async (req, res) => {
  const wishList = await WishList.findOne({ userId: req.user.userId });
  return res.status(200).json({ count: wishList ? wishList.items.length : 0 });
};

const getCartCount = async (req, res) => {
  const cartList = await CartList.findOne({ userId: req.user.userId });
  return res.status(200).json({ count: cartList ? cartList.items.length : 0 });
};

const getOrderStats = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.userId);

  const totalOrders = await Order.countDocuments({
    userId,
    deletedByUser: { $ne: true },
  });

  const result = await Order.aggregate([
    {
      $match: {
        userId,
        status: { $ne: "cancelled" },
        deletedByUser: { $ne: true },
      },
    },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const totalSpent = result.length > 0 ? result[0].total : 0;
  return res.status(200).json({ totalOrders, totalSpent });
};

const getSpendingOverTime = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.userId);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const result = await Order.aggregate([
    {
      $match: {
        userId,
        status: { $ne: "cancelled" },
        deletedByUser: { $ne: true },
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        total: { $sum: "$totalPrice" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return res.status(200).json({ spendingOverTime: result });
};

const getOrderStatus = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.userId);

  const result = await Order.aggregate([
    {
      $match: {
        userId,
        deletedByUser: { $ne: true },
      },
    },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  return res.status(200).json({ orderStatus: result });
};

const getOrderHistory = async (req, res) => {
  const orders = await Order.find({
    userId: req.user.userId,
    deletedByUser: { $ne: true },
  })
    .populate("items.carId", "brand model image")
    .sort({ createdAt: -1 })
    .limit(5);

  return res.status(200).json({ orders });
};

module.exports = {
  getWishlistCount,
  getCartCount,
  getOrderStats,
  getSpendingOverTime,
  getOrderStatus,
  getOrderHistory,
};