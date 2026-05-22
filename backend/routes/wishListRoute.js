const express = require("express");
const router = express.Router();
const WishListSchema = require("../models/WishListSchema");
const Car = require("../models/CarSchema");
const verifyToken = require("../middleware/verifyToken");
const mongoose = require('mongoose');
const { isValidObjectId } = require('../utils/objectId');

router.get("/", verifyToken, async (req, res) => {
    try {
        const wishList = await WishListSchema.findOne({ userId: req.user.userId }).populate("items.carId");
        if (!wishList) return res.json({ items: [] });
        res.status(200).json(wishList);
    } catch (err) {
        console.error("Wishlist GET error:", err.message);
        res.status(500).json({ message: "Failed to load wishlist" });
    }
});

router.post("/", verifyToken, async (req, res) => {
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
        const wishList = await WishListSchema.findOneAndUpdate(
            { userId: req.user.userId },
            { $addToSet: { items: { carId: carObjectId } } },
            { new: true, upsert: true }
        ).populate("items.carId");

        res.status(201).json(wishList);
    } catch (err) {
        console.error("Wishlist POST error:", err.message);
        res.status(500).json({ message: "Failed to add to wishlist" });
    }
});

router.delete("/:carId", verifyToken, async (req, res) => {
    try {
        if (!isValidObjectId(req.params.carId)) {
            return res.status(400).json({ message: "Invalid carId" });
        }

        const wishList = await WishListSchema.findOneAndUpdate(
            { userId: req.user.userId },
            { $pull: { items: { carId: new mongoose.Types.ObjectId(req.params.carId) } } },
            { new: true }
        ).populate("items.carId");

        res.json(wishList);
    } catch (err) {
        console.error("Wishlist DELETE error:", err.message);
        res.status(500).json({ message: "Failed to remove from wishlist" });
    }
});

module.exports = router;
