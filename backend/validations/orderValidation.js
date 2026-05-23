const { body: validate } = require("express-validator");

const orderValidation = [
  validate("car").notEmpty().withMessage("Car required"),

  validate("paymentMethod").notEmpty().withMessage("Payment required"),

  validate("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone invalid"),
];

module.exports = {
  orderValidation,
};