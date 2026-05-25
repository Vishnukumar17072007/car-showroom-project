const { body: validate } = require('express-validator');

const addCarValidation=[

validate('brand')
.trim()
.notEmpty()
.withMessage(
"Brand required"
),

validate('model')
.trim()
.notEmpty()
.withMessage(
"Model required"
),

validate('bodyType')
.trim()
.notEmpty()
.withMessage(
"Body type required"
),

validate('image')
.trim()
.notEmpty()
.withMessage(
"image required"
),

validate('frontImage')
.trim()
.notEmpty()
.withMessage(
"frontImage required"
),

validate('rearImage')
.trim()
.notEmpty()
.withMessage(
"rearImage required"
),

validate('rightSideImage')
.trim()
.notEmpty()
.withMessage(
"rightSideImage required"
),

validate('leftSideImage')
.trim()
.notEmpty()
.withMessage(
"leftSideImage required"
),

validate('fuelType')
.trim()
.notEmpty()
.withMessage(
"Fuel type required"
),

validate('transmission')
.trim()
.notEmpty()
.withMessage(
"transmission type required"
),

validate('engineType')
.trim()
.notEmpty()
.withMessage(
"Engine type required"
),

validate('mileage')
.trim()
.notEmpty()
.withMessage(
"Mileage required"
),

validate('available')
.isNumeric()
.withMessage(
"available required"
),

validate('price')
.isNumeric()
.withMessage(
"Price must be number"
),

validate('rating')
.optional()
.isFloat({
min:0,
max:10
})
.withMessage(
"Rating must be 0-5"
),

validate('seats')
.optional()
.isInt({
min:1
})
.withMessage(
"Seats invalid"
)

];


module.exports={
addCarValidation
};