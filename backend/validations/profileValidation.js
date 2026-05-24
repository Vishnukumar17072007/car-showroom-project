const { body: validate } = require("express-validator");

const updateProfileValidation = [
  validate("userName").trim().notEmpty().withMessage("Username required"),

  validate('phone')
    .custom((value)=>{
        const cleanedPhone = value.replace(/\D/g,'');
        if(cleanedPhone.length!==12 && cleanedPhone.length!==10){
            throw new Error("Invalid phone number");
        }
        return true;
    }),

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
