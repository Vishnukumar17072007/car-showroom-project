const { body: validate } = require('express-validator');

const registerValidation=[
    validate('userName').trim().notEmpty().withMessage("Username required"),
    validate('email').trim().isEmail().withMessage("Invalid email"),
    validate('password').isLength({min:8}).withMessage("Password minimum 8 characters"),
    validate('phone').matches(/^[0-9]{10}$/).withMessage("Phone must contain 10 digits")
];


const loginValidation=[
    validate('email').trim().isEmail().withMessage("Invalid email"),
    validate('password').notEmpty().withMessage("Password required")
];


module.exports = { registerValidation, loginValidation};