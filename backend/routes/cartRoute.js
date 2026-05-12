const express = require('express');
const router = express.Router();
const CartListSchema = require('../models/CartListSchema');
const verifyToken = require('../middleware/verifyToken');
const mongoose = require('mongoose');

router.get('/', verifyToken, async(req, res) => {
    try{
        const cart = await CartListSchema.findOne({userId: req.user.userId}).populate("items.carId");
        if(!cart){
            return res.json({ item: []});
        }
        res.status(200).json(cart);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/', verifyToken, async(req, res) => {
    const { carId } = req.body;

    try{
        if(!carId){
            return res.status(400).json({ message: "carId is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(carId)) {
            return res.status(400).json({ message: "Invalid carId" });
        }
        const carObjectId = new mongoose.Types.ObjectId(carId);
        const cart = await CartListSchema.findOneAndUpdate(
            {userId: req.user.userId},
            {$addToSet: {items: {carId: carObjectId}}},
            {new: true, upsert: true}
        ).populate("items.carId");
        res.status(201).json(cart);
    }
    catch(err){
        res.status(500).json({message : err.message});
    }
});

router.delete("/:carId", verifyToken, async(req, res) => {
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.carId)) {
            return res.status(400).json({ message: "Invalid carId" });
        }
        const carObjectId = new mongoose.Types.ObjectId(req.params.carId);
        const cart = await CartListSchema.findOneAndUpdate(
            {userId: req.user.userId},
            {$pull: {items: {carId: carObjectId}}},
            {new: true}
        ).populate("items.carId");
        res.status(200).json(cart);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;