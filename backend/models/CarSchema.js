const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  carName: String,
  brand: String,
  model: String,
  bodyType: String,
  image: String,
  frontImage: String,
  rearImage: String,
  rightSideImage: String,
  leftSideImage: String,
  price: Number,
  rating: Number,
  transmission: String,
  engineType: String,
  seats: Number,
  mileage: String,
  fuelType: String,
  available: { type: Number, default: 1 },
  isDeleted: { type: Boolean, default: false },
});

carSchema.index({ isDeleted: 1, brand: 1, price: 1 });
carSchema.index({ isDeleted: 1, available: 1 });

module.exports = mongoose.model('Car', carSchema, 'CarLists');
