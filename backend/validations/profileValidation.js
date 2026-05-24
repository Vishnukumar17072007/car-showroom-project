const { body: validate } = require("express-validator");

const updateProfileValidation = [
  validate("userName").trim().notEmpty().withMessage("Username required"),

  validate("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone must contain 10 digits"),

  validate("address").optional().trim(),

  validate("city").optional().trim(),

  validate("state").optional().trim(),

  validate("pincode")
    .optional()
    .isLength({
      min: 6,
      max: 6,
    })
    .withMessage("Invalid pincode"),

  validate("newPassword")
    .optional()
    .isLength({
      min: 8,
    })
    .withMessage("Password minimum 8 characters"),
];

module.exports = {
  updateProfileValidation,
};
