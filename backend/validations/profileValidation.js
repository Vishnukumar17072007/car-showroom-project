const { body: validate } = require('express-validator');

const updateProfileValidation=[
    validate('userName').trim().notEmpty().withMessage("Username required"),
    validate('phone').matches(/^[0-9]{10}$/).withMessage("Phone must contain 10 digits"),
    validate('location.address').optional().trim(),
    validate('location.city').optional().trim(),
    validate('location.state').optional().trim(),
    validate('location.pincode').optional().isLength({min:6,max:6}).withMessage("Invalid pincode"),
    validate('newPassword').optional().isLength({min:8}).withMessage("Password minimum 8 characters")
];

module.exports={updateProfileValidation};