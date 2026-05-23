const { body: validate } = require('express-validator');

const cartValidation=[
  validate('carId').notEmpty().withMessage("Car id required"),
  validate('quantity').optional().isInt({min:1}).withMessage("Invalid quantity")
];

module.exports = {cartValidation};