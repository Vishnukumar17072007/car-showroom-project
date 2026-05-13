const express = require('express');
const router = express.Router();
const Car = require('../models/CarSchema');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');

// GET all cars
router.get('/', async (req, res) => {
    try {
      const {brand, model, bodyType, available, transmission, fuelType, maxPrice, search} = req.query;

      const query = {};

      if(brand) query.brand = { $regex: brand, $options: "i" };
      if(model) query.model = { $regex: model, $options: "i" };
      if(available === "true") query.available = { $gt: 0 };
      if(transmission) query.transmission = { $regex: transmission, $options: "i" };
      if(bodyType) query.bodyType = { $regex: bodyType, $options: "i" };
      if(fuelType) query.fuelType = { $regex: fuelType, $options: "i" };
      if(maxPrice < 10000000) {
        if(maxPrice) query.price = { $lte: Number(maxPrice) };
      }
      else{
      if(maxPrice) query.price = { $gte: Number(maxPrice) };
      }
      if(search) query.$or = [
        { carName:    { $regex: search, $options: "i" } },
        { brand:      { $regex: search, $options: "i" } },
        { model:      { $regex: search, $options: "i" } },
        { bodyType:   { $regex: search, $options: "i" } },
        { fuelType:   { $regex: search, $options: "i" } },
        { transmission: { $regex: search, $options: "i" } },
      ];
      query.isDeleted = false;

      const cars = await Car.find(query).maxTimeMS(5000);
      res.json(cars);

    }
    catch (err) { 
      console.log('Error:', err);
      res.status(500).json({ message: err.message });
    }
  });

// GET single car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if(!car) {
      return res.status(404).json({ message: 'Car not Found.'});
    }
    
    res.json(car);
  }
  catch (err) {
    res.status(500).json({ message: "Frontend Error = "+err.message });
  }
});

//verifying role using token
router.post('/addCar', verifyToken, verifyRole("admin"), async(req, res) => {
  try{
    const {brand, model, bodyType, image, price, rating, available} = req.body;

    const newCar = new Car({
      carName : brand + " " + model,
      brand,
      model,
      bodyType,
      image,
      price,
      rating,
      available: available ?? 1
    });

    await newCar.save();
    res.status(201).json(newCar);
  }
  catch(err){
    console.log('addCar error: ',err.message);
    res.status(500).json({message: err.message});
  }
});

//verifying role to update any car list
router.put('/:id', verifyToken, verifyRole("admin"), async(req, res) => {
  try{
    const {brand, model, bodyType, image, price, rating} = req.body;

    const updateCar = await Car.findByIdAndUpdate(
      req.params.id,
      { $set: { carName: brand + " " + model, brand, model, bodyType, image, price, rating } },
      { returnDocument: 'after' }
    );

    if(!updateCar){
      return res.status(400).json({message: "Car not found"});
    }

    res.status(200).json({updateCar});
  }
  catch(err){
    res.status(500).json({message: err.message});
  }
});

// Decrement availability when a user "sells" (no admin role required)
router.put('/:id/sell', verifyToken, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Your seed data doesn't set `available`, so treat missing as 1 unit.
    const currentAvailable = (car.available ?? 1);

    if (currentAvailable <= 0) {
      return res.status(400).json({ message: "Car is not available to sell." });
    }

    car.available = currentAvailable - 1;
    await car.save();

    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//verifying role to delete car list
router.delete('/:id', verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id); // ✅ id from URL

    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ message: "Car deleted successfully." });
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch(`/soft-delete/:id`, verifyToken, verifyRole('admin'), async (req, res) => {
  try{
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if(!car){
      return res.status(404).json({ message: "car not found" });
    }

    res.status(200).json("car soft-deleted successfully.");
  }
  catch(err){
    res.status(500).json({message: err.message});
  }
});

module.exports = router;