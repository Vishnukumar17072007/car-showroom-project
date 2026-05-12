const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
    userId: {type : mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true},
    items: [{ carId: {type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true} }]
});

module.exports = mongoose.model("WishList", wishListSchema, "WishLists")