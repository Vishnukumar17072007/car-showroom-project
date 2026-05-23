const { body: validate } = require("express-validator");

const wishlistValidation = [
  validate("car").notEmpty().withMessage("Car id required"),
];

module.exports = {wishlistValidation};
