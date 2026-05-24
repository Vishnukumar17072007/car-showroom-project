const Car = require("../models/CarSchema");
const { isValidObjectId } = require("../utils/objectId");

const updateCar = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    const error = new Error("Invalid car id");

    error.status = 400;

    throw error;
  }

  const updateCar = await Car.findOneAndUpdate(
    {
      _id: req.params.id,
      isDeleted: false,
    },

    {
      $set: {
        ...req.body,

        carName: `${req.body.brand}
${req.body.model}`,
      },
    },

    {
      new: true,
    },
  );

  if (!updateCar) {
    const error = new Error("Car not found");

    error.status = 404;

    throw error;
  }

  res.status(200).json(updateCar);
};

const deleteCar = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    const error = new Error("Invalid car id");

    error.status = 400;

    throw error;
  }

  const car = await Car.findOneAndUpdate(
    {
      _id: req.params.id,
      isDeleted: false,
    },

    {
      $set: {
        isDeleted: true,
      },
    },

    {
      new: true,
    },
  );

  if (!car) {
    const error = new Error("Car not found");

    error.status = 404;

    throw error;
  }

  res.status(200).json({
    message: "Car deleted successfully",
  });
};

module.exports = {
  updateCar,
  deleteCar,
};
