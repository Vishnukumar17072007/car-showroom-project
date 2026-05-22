const express = require('express');
const router = express.Router();
const Car = require('../models/CarSchema');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');
const { safeRegex } = require('../utils/regex');
const { isValidObjectId } = require('../utils/objectId');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(async (req, res) => {
        const { brand, model, bodyType, available, transmission, fuelType, maxPrice, search } = req.query;
        const query = { isDeleted: false };

        const brandRx = safeRegex(brand);
        if (brandRx) query.brand = brandRx;
        const modelRx = safeRegex(model);
        if (modelRx) query.model = modelRx;
        if (available === "true") query.available = { $gt: 0 };
        const transmissionRx = safeRegex(transmission);
        if (transmissionRx) query.transmission = transmissionRx;
        const bodyTypeRx = safeRegex(bodyType);
        if (bodyTypeRx) query.bodyType = bodyTypeRx;
        const fuelTypeRx = safeRegex(fuelType);
        if (fuelTypeRx) query.fuelType = fuelTypeRx;

        if (maxPrice) {
            const priceNum = Number(maxPrice);
            if (!Number.isNaN(priceNum)) {
                if (priceNum < 10000000) {
                    query.price = { $lte: priceNum };
                } else {
                    query.price = { $gte: priceNum };
                }
            }
        }

        const searchRx = safeRegex(search);
        if (searchRx) {
            query.$or = [
                { carName: searchRx },
                { brand: searchRx },
                { model: searchRx },
                { bodyType: searchRx },
                { fuelType: searchRx },
                { transmission: searchRx },
            ];
        }

        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
        const skip = (page - 1) * limit;

        const [cars, total] = await Promise.all([
            Car.find(query).skip(skip).limit(limit).lean().maxTimeMS(5000),
            Car.countDocuments(query),
        ]);

        res.json({ cars, total, page, pages: Math.ceil(total / limit) || 1 });
}));

router.post('/addCar', verifyToken, verifyRole("admin"), async (req, res) => {
    try {
        const {
            brand, model, bodyType, image, frontImage, rearImage,
            leftSideImage, rightSideImage, price, rating, available,
            fuelType, transmission, engineType, seats, mileage,
        } = req.body;

        if (!brand?.trim() || !model?.trim() || !bodyType?.trim() || !image?.trim()) {
            return res.status(400).json({ message: "Brand, model, body type, and image are required." });
        }

        const newCar = new Car({
            carName: `${brand} ${model}`,
            brand,
            model,
            bodyType,
            image,
            frontImage,
            rearImage,
            leftSideImage,
            rightSideImage,
            fuelType,
            transmission,
            engineType,
            seats,
            mileage,
            price,
            rating,
            available: available ?? 1,
        });

        await newCar.save();
        res.status(201).json(newCar);
    } catch (err) {
        console.error('addCar error:', err);
        res.status(500).json({ message: 'Failed to add car' });
    }
});

router.patch('/soft-delete/:id', verifyToken, verifyRole('admin'), async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid car id" });
        }

        const car = await Car.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json({ message: "Car deleted successfully." });
    } catch (err) {
        console.error('Soft delete error:', err);
        res.status(500).json({ message: 'Failed to delete car' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid car id' });
        }

        const car = await Car.findOne({ _id: req.params.id, isDeleted: false });

        if (!car) {
            return res.status(404).json({ message: 'Car not found.' });
        }

        res.json(car);
    } catch (err) {
        console.error('Car detail error:', err);
        res.status(500).json({ message: 'Failed to load car' });
    }
});

router.put('/:id', verifyToken, verifyRole("admin"), async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid car id" });
        }

        const {
            brand, model, bodyType, image, frontImage, rearImage,
            leftSideImage, rightSideImage, price, rating, available,
            fuelType, transmission, engineType, seats, mileage,
        } = req.body;

        const updateCar = await Car.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            {
                $set: {
                    carName: `${brand} ${model}`,
                    brand, model, bodyType, image, frontImage, rearImage,
                    leftSideImage, rightSideImage, price, rating, available,
                    fuelType, transmission, engineType, seats, mileage,
                },
            },
            { returnDocument: 'after' }
        );

        if (!updateCar) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json({ updateCar });
    } catch (err) {
        console.error('Update car error:', err);
        res.status(500).json({ message: 'Failed to update car' });
    }
});

router.delete('/:id', verifyToken, verifyRole("admin"), async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid car id" });
        }

        const car = await Car.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.status(200).json({ message: "Car deleted successfully." });
    } catch (err) {
        console.error('Delete car error:', err);
        res.status(500).json({ message: 'Failed to delete car' });
    }
});

module.exports = router;
