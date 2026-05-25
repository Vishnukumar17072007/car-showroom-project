const { body: validate } =
require('express-validator');


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