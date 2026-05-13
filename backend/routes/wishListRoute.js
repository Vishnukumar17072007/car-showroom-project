const express = require("express");
const router = express.Router();
const WishListSchema = require("../models/WishListSchema");
const verifyToken = require("../middleware/verifyToken");
const { Types } = require('mongoose');

router.get("/", verifyToken, async(req, res) => {
    try{
        const wishList = await WishListSchema.findOne({userId: req.user.userId}).populate("items.carId");
        if(!wishList) return res.json({items: []});
        res.status(200).json(wishList);
    }
    catch(err){console.error("Wishlist DELETE error:", err.message);
        res.status(500).json({message: err.message});
    }
});

router.post("/", verifyToken, async(req, res) => {
    const { carId } = req.body;
    try{
        const carObjectId = new Types.ObjectId(carId);
        const wishList = await WishListSchema.findOneAndUpdate(
            { userId: req.user.userId},
            { $addToSet: {items: {carId: carObjectId}}},
            { new: true, upsert: true }
        ).populate("items.carId");
        res.status(201).json(wishList);
    }
    catch(err){console.error("Wishlist DELETE error:", err.message);
        res.status(500).json({message: err.message});
    }
});

router.delete("/:carId", verifyToken, async(req, res) => {
    try{
        const wishList = await WishListSchema.findOneAndUpdate(
            {userId: req.user.userId},
            { $pull: { items: { carId: new Types.ObjectId(req.params.carId) } } },
            {new: true}
        ).populate("items.carId");
        res.json(wishList);
    }
    catch(err){console.error("Wishlist DELETE error:", err.message);
        res.status(500).json({message: err.message});
    }
});

module.exports = router;