const { body: validate } = require('express-validator');

const wishlistValidation=[
  validate('carId')
  .notEmpty()
  .withMessage("Car id required")
];

module.exports={wishlistValidation};