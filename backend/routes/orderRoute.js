const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/OrderSchema');
const Cart  = require('../models/CartListSchema');
const Car   = require('../models/CarSchema');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { shippingDetails, carIds } = req.body;
        const userId = req.user.userId;

        const { name, mobile, address, city, pincode } = shippingDetails || {};
        if (!name || !mobile || !address || !city || !pincode) {
            return res.status(400).json({ message: "All shipping fields should be filled" });
        }

        const cartDoc = await Cart.findOne({ userId }).populate('items.carId');

        if (!cartDoc || cartDoc.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // filter to only the cars the user chose to buy
        const selectedItems = cartDoc.items.filter(item => {
            if (!item.carId) return false;
            if (!carIds || carIds.length === 0) return true; // Buy All fallback
            return carIds.map(String).includes(String(item.carId._id));
        });

        if (selectedItems.length === 0) {
            return res.status(400).json({ message: "No valid cars selected" });
        }

        const totalPrice = selectedItems.reduce((sum, item) => {
            return sum + (item.carId?.price || 0);
        }, 0);

        const order = new Order({
            userId,
            items: selectedItems.map(item => ({
                carId: new mongoose.Types.ObjectId(item.carId._id)
            })),
            totalPrice,
            status: "pending",
            shippingDetails
        });
        await order.save();

        const bulkOps = selectedItems.map(item => ({
            updateOne: {
                filter: { 
                    _id: item.carId._id,
                    available: { $gt: 0 }   // ← safety guard
                },
                update: { $inc: { available: -1 } }
            }
        }));
        await Car.bulkWrite(bulkOps);

        // only remove the ordered cars from the cart
        const orderedObjectIds = selectedItems.map(item => item.carId._id);
        await Cart.updateOne(
            { userId },
            { $pull: { items: { carId: { $in: orderedObjectIds } } } }
        );

        res.status(201).json({ message: "Order placed successfully" });
    } catch (err) {
        console.error("Order POST error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;         // ← fixed
        const orders = await Order.find({ userId })
            .populate('items.carId')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        console.error("Order GET error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.delete('/delete/:orderId', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { orderId } = req.params;

        const order = await Order.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(orderId),
            userId,               // ensures user owns this order
            status: 'pending'     // only pending orders can be cancelled
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found or cannot be cancelled" });
        }

        res.status(200).json({ message: "Order cancelled successfully" });
    } catch (err) {
        console.error("Order DELETE error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Admin: get ALL orders from ALL users
router.get('/admin/all', verifyToken, verifyRole('admin'), async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('items.carId')
            .populate('userId', 'name email') // ✅ pulls user name & email into each order
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        console.error("Admin Order GET error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Admin: update order status
router.put('/admin/:orderId/status', verifyToken, verifyRole('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { $set: { status } },
            { new: true }
        );

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Status updated", order });
    } catch (err) {
        console.error("Admin status update error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;