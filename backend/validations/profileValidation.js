const { body: validate } = require('express-validator');

const updateProfileValidation=[
    validate('userName').trim().notEmpty().withMessage("Username required"),
    validate('phone').matches(/^[0-9]{10}$/).withMessage("Phone must contain 10 digits"),
    validate('location.address').trim().notEmpty().withMessage("Address required"),
    validate('location.city').trim().notEmpty().withMessage("City required"),
    validate('location.state').trim().notEmpty().withMessage("State required"),
    validate('location.pincode').isLength({min:6,max:6}).withMessage("Invalid pincode"),
    validate('newPassword').optional().isLength({min:8}).withMessage("Password minimum 8 characters")
];

module.exports={updateProfileValidation};