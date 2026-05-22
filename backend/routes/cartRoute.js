const express = require('express');
const router = express.Router();
const CartListSchema = require('../models/CartListSchema');
const Car = require('../models/CarSchema');
const verifyToken = require('../middleware/verifyToken');
const mongoose = require('mongoose');
const { isValidObjectId } = require('../utils/objectId');

router.get('/', verifyToken, async (req, res) => {
    try {
        const cart = await CartListSchema.findOne({ userId: req.user.userId }).populate("items.carId");
        if (!cart) {
            return res.json({ items: [] });
        }
        res.status(200).json(cart);
    } catch (err) {
        console.error('Cart GET error:', err);
        res.status(500).json({ message: 'Failed to load cart' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { carId } = req.body;

    try {
        if (!carId) {
            return res.status(400).json({ message: "carId is required" });
        }
        if (!isValidObjectId(carId)) {
            return res.status(400).json({ message: "Invalid carId" });
        }

        const car = await Car.findOne({ _id: carId, isDeleted: false });
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        const carObjectId = new mongoose.Types.ObjectId(carId);
        const cart = await CartListSchema.findOneAndUpdate(
            { userId: req.user.userId },
            { $addToSet: { items: { carId: carObjectId } } },
            { new: true, upsert: true }
        ).populate("items.carId");

        res.status(201).json(cart);
    } catch (err) {
        console.error('Cart POST error:', err);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
});

router.delete("/:carId", verifyToken, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.carId)) {
            return res.status(400).json({ message: "Invalid carId" });
        }

        const carObjectId = new mongoose.Types.ObjectId(req.params.carId);
        const cart = await CartListSchema.findOneAndUpdate(
            { userId: req.user.userId },
            { $pull: { items: { carId: carObjectId } } },
            { new: true }
        ).populate("items.carId");

        res.status(200).json(cart);
    } catch (err) {
        console.error('Cart DELETE error:', err);
        res.status(500).json({ message: 'Failed to remove from cart' });
    }
});

module.exports = router;
