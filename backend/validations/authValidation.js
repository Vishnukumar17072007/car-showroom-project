const { body: validate } = require('express-validator');

const registerValidation=[
    validate('userName').trim().notEmpty().withMessage("Username required"),
    validate('email').trim().isEmail().withMessage("Invalid email"),
    validate('password').isLength({min:8}).withMessage("Password minimum 8 characters"),
    validate('phone').custom((value) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length !== 10 && digits.length !== 12) {
            throw new Error('Phone must contain 10 digits');
        }
        return true;
    })
];


const loginValidation=[
    validate('email').trim().isEmail().withMessage("Invalid email"),
    validate('password').notEmpty().withMessage("Password required")
];


module.exports = { registerValidation, loginValidation};