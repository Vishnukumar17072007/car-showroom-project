const express = require("express");
const router = express.Router();
const { addCarValidation } = require("../validations/carValidation");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const validateRequest = require("../middleware/validationMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const { getCars, getCarById, addCar, updateCar, deleteCar } = require("../controllers/carController");

router.get("/", asyncHandler(getCars));
router.get("/:id", asyncHandler(getCarById));
//admin route
router.post("/", verifyToken, verifyRole("admin"), addCarValidation, validateRequest, asyncHandler(addCar));
router.put("/:id", verifyToken, verifyRole("admin"), addCarValidation, validateRequest, asyncHandler(updateCar));
router.patch("/soft-delete/:id", verifyToken, verifyRole("admin"), asyncHandler(deleteCar));

module.exports = router;