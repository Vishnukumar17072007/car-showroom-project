const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/OrderSchema');
const Cart = require('../models/CartListSchema');
const Car = require('../models/CarSchema');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');
const { isValidObjectId } = require('../utils/objectId');
const { runInTransaction } = require('../utils/transaction');

async function restoreInventory(items, session) {
    const bulkOps = items.map((item) => ({
        updateOne: {
            filter: { _id: item.carId },
            update: { $inc: { available: 1 } },
        },
    }));
    if (bulkOps.length > 0) {
        const opts = session ? { session } : {};
        await Car.bulkWrite(bulkOps, opts);
    }
}

function sessionOpts(session) {
    return session ? { session } : {};
}

router.post('/', verifyToken, async (req, res) => {
    try {
        const result = await runInTransaction(async (session) => {
            const { shippingDetails, carIds } = req.body;
            const userId = req.user.userId;

            const { name, mobile, address, city, pincode } = shippingDetails || {};
            if (!name || !mobile || !address || !city || !pincode) {
                const err = new Error('VALIDATION');
                err.status = 400;
                err.payload = { message: 'All shipping fields are required' };
                throw err;
            }

            const cartDoc = await Cart.findOne({ userId })
                .populate('items.carId')
                .session(session || null);

            if (!cartDoc || cartDoc.items.length === 0) {
                const err = new Error('VALIDATION');
                err.status = 400;
                err.payload = { message: 'Your cart is empty' };
                throw err;
            }

            const selectedItems = cartDoc.items.filter((item) => {
                if (!item.carId || item.carId.isDeleted) return false;
                if (!carIds || carIds.length === 0) return true;
                return carIds.map(String).includes(String(item.carId._id));
            });

            if (selectedItems.length === 0) {
                const err = new Error('VALIDATION');
                err.status = 400;
                err.payload = { message: 'No valid cars selected' };
                throw err;
            }

            for (const item of selectedItems) {
                const updated = await Car.findOneAndUpdate(
                    { _id: item.carId._id, available: { $gt: 0 }, isDeleted: false },
                    { $inc: { available: -1 } },
                    { new: true, ...sessionOpts(session) }
                );
                if (!updated) {
                    const err = new Error('STOCK');
                    err.status = 409;
                    err.payload = { message: 'One or more cars are out of stock' };
                    throw err;
                }
            }

            const orderItems = selectedItems.map((item) => ({
                carId: item.carId._id,
                priceAtPurchase: item.carId.price,
                carName: item.carId.carName || `${item.carId.brand} ${item.carId.model}`,
            }));

            const totalPrice = orderItems.reduce((sum, item) => sum + (item.priceAtPurchase || 0), 0);

            const order = new Order({
                userId,
                items: orderItems,
                totalPrice,
                status: 'pending',
                shippingDetails: {
                    name,
                    mobile: Number(mobile),
                    address,
                    city,
                    pincode: Number(pincode),
                },
            });

            await order.save(sessionOpts(session));

            const orderedObjectIds = selectedItems.map((item) => item.carId._id);
            await Cart.updateOne(
                { userId },
                { $pull: { items: { carId: { $in: orderedObjectIds } } } },
                sessionOpts(session)
            );

            return { orderId: order._id };
        });

        res.status(201).json({ message: 'Order placed successfully', orderId: result.orderId });
    } catch (err) {
        if (err.status && err.payload) {
            return res.status(err.status).json(err.payload);
        }
        console.error('Order POST error:', err);
        res.status(500).json({ message: 'Order failed' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .populate('items.carId')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        console.error('Order GET error:', err);
        res.status(500).json({ message: 'Failed to load orders' });
    }
});

router.patch('/cancel/:orderId', verifyToken, async (req, res) => {
    try {
        await runInTransaction(async (session) => {
            const { orderId } = req.params;
            if (!isValidObjectId(orderId)) {
                const err = new Error('VALIDATION');
                err.status = 400;
                err.payload = { message: 'Invalid order id' };
                throw err;
            }

            const order = await Order.findOne({
                _id: orderId,
                userId: req.user.userId,
            }).session(session || null);

            if (!order) {
                const err = new Error('VALIDATION');
                err.status = 404;
                err.payload = { message: 'Order not found' };
                throw err;
            }

            if (order.status !== 'pending') {
                const err = new Error('VALIDATION');
                err.status = 400;
                err.payload = { message: `Cannot cancel an order that is already ${order.status}` };
                throw err;
            }

            await restoreInventory(order.items, session);
            order.status = 'cancelled';
            await order.save(sessionOpts(session));
        });

        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (err) {
        if (err.status && err.payload) {
            return res.status(err.status).json(err.payload);
        }
        console.error('Order PATCH cancel error:', err);
        res.status(500).json({ message: 'Failed to cancel order' });
    }
});

router.delete('/delete/:orderId', verifyToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!isValidObjectId(orderId)) {
            return res.status(400).json({ message: 'Invalid order id' });
        }

        const order = await Order.findOneAndDelete({
            _id: orderId,
            userId: req.user.userId,
            status: { $in: ['delivered', 'cancelled'] },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or cannot be deleted' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Order DELETE error:', err);
        res.status(500).json({ message: 'Failed to delete order' });
    }
});

router.get('/admin/all', verifyToken, verifyRole('admin'), async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('items.carId')
            .populate('userId', 'userName email phone')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        console.error('Admin Order GET error:', err);
        res.status(500).json({ message: 'Failed to load orders' });
    }
});

router.put('/admin/:orderId/status', verifyToken, verifyRole('admin'), async (req, res) => {
    try {
        const order = await runInTransaction(async (session) => {
            const { status } = req.body;
            const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];

            if (!validStatuses.includes(status)) {
                const err = new Error('VALIDATION');
                err.status = 400;
                err.payload = { message: 'Invalid status value' };
                throw err;
            }

            if (!isValidObjectId(req.params.orderId)) {
                const err = new Error('VALIDATION');
                err.status = 400;
                err.payload = { message: 'Invalid order id' };
                throw err;
            }

            const found = await Order.findById(req.params.orderId).session(session || null);
            if (!found) {
                const err = new Error('VALIDATION');
                err.status = 404;
                err.payload = { message: 'Order not found' };
                throw err;
            }

            const wasActive = ['pending', 'confirmed'].includes(found.status);
            const becomingCancelled = status === 'cancelled' && found.status !== 'cancelled';

            if (becomingCancelled && wasActive) {
                await restoreInventory(found.items, session);
            }

            found.status = status;
            await found.save(sessionOpts(session));
            return found;
        });

        res.status(200).json({ message: 'Status updated', order });
    } catch (err) {
        if (err.status && err.payload) {
            return res.status(err.status).json(err.payload);
        }
        console.error('Admin status update error:', err);
        res.status(500).json({ message: 'Failed to update status' });
    }
});

module.exports = router;
