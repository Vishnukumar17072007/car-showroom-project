const User = require("../models/UserSchema");
const Car = require("../models/CarSchema");
const Order = require("../models/OrderSchema");

const getDashboardStats = async (req, res) => {
    const [totalUsers, totalCars, totalOrders, orders, carsByBodyType] = await Promise.all([
        User.countDocuments(),
        Car.countDocuments({ isDeleted: false }),
        Order.countDocuments(),
        Order.find().lean(),
        Car.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$bodyType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

    // Status breakdown for pie chart
    const statusCounts = { pending: 0, approved: 0, delivered: 0, cancelled: 0, in_progress: 0, rejected: 0 };
    orders.forEach(o => {
        if (statusCounts[o.status] !== undefined) statusCounts[o.status]++;
    });

    // Monthly data (last 7 months) for line chart
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

const getRecentOrders = async (req, res) => {
    const orders = await Order.find()
        .populate("userId", "userName email")
        .populate("items.carId", "brand model image price")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    res.status(200).json(orders);
};

module.exports = { getDashboardStats, getRecentOrders };