const User = require("../models/UserSchema");
const Car = require("../models/CarSchema");
const Order = require("../models/OrderSchema");
const WishList = require('../models/WishListSchema');
const CartList = require('../models/CartListSchema');
const mongoose = require('mongoose');

// ─── SHARED: Dashboard Stats ───────────────────────────────────────
const getDashboardStats = async (req, res) => {
    const isAdmin = req.user.role === "admin";
    const userId  = isAdmin ? null : new mongoose.Types.ObjectId(req.user.userId);
    const filter  = isAdmin ? {} : { userId };

    const [totalUsers, totalCars, totalOrders, orders, carsByBodyType] = await Promise.all([
        User.countDocuments(),
        Car.countDocuments({ isDeleted: false }),
        Order.countDocuments(filter),
        Order.find(filter).lean(),
        Car.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$bodyType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

    const statusCounts = { pending: 0, approved: 0, delivered: 0, cancelled: 0, in_progress: 0, rejected: 0 };
    orders.forEach(o => {
        if (statusCounts[o.status] !== undefined) statusCounts[o.status]++;
    });

    const monthlyMap = {};
    orders.forEach(o => {
        const d = new Date(o.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyMap[key]) {
            monthlyMap[key] = {
                month: new Date(d.getFullYear(), d.getMonth(), 1)
                    .toLocaleString("en-IN", { month: "short", year: "2-digit" }),
                orders: 0,
                revenue: 0
            };
        }
        monthlyMap[key].orders++;
        monthlyMap[key].revenue += Number(o.totalPrice || 0);
    });

    const monthlyData = Object.values(monthlyMap)
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-7);

    res.status(200).json({
        totalUsers,
        totalCars,
        totalOrders,
        totalRevenue,
        statusCounts,
        monthlyData,
        carsByBodyType: carsByBodyType.map(c => ({
            name: c._id || "Unknown",
            count: c.count
        }))
    });
};

// ─── SHARED: Recent Orders ─────────────────────────────────────────
const getRecentOrders = async (req, res) => {
    const isAdmin = req.user.role === "admin";
    const userId  = isAdmin ? null : new mongoose.Types.ObjectId(req.user.userId);
    const filter  = isAdmin ? {} : { userId };

    const orders = await Order.find(filter)
        .populate("userId", "userName email")
        .populate("items.carId", "brand model image price")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    res.status(200).json(orders);
};

// ─── USER ONLY: Wishlist Count ─────────────────────────────────────
const getWishlistCount = async (req, res) => {
    const wishList = await WishList.findOne({ userId: req.user.userId });
    return res.status(200).json({ count: wishList ? wishList.items.length : 0 });
};

// ─── USER ONLY: Cart Count ─────────────────────────────────────────
const getCartCount = async (req, res) => {
    const cartList = await CartList.findOne({ userId: req.user.userId });
    return res.status(200).json({ count: cartList ? cartList.items.length : 0 });
};

// ─── USER ONLY: Order Stats ────────────────────────────────────────
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

// ─── USER ONLY: Spending Over Time ────────────────────────────────
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

// ─── USER ONLY: Order Status Breakdown ────────────────────────────
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

// ─── USER ONLY: Order History ──────────────────────────────────────
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
    getDashboardStats,
    getRecentOrders,
    getWishlistCount,
    getCartCount,
    getOrderStats,
    getSpendingOverTime,
    getOrderStatus,
    getOrderHistory,
};