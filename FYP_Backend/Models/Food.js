const mongoose = require('mongoose');
const { Schema } = mongoose;

const foodSchema = new Schema({
  f_id: {
    type: String,
    // required: true  // Keep this field required
  },
  foodName: {
    type: String,
    required: true 
    // Not required, so you can omit `required: true`
  },
  category: {
    type: String,
    required: true 
    // Not required, so you can omit `required: true`
  },
  likelyToEatIn: {
    type: String,
    // Not required, so you can omit `required: true`
  },
  quantity: {
    type: Number,
    required: true 
    // Not required, so you can omit `required: true`
  },
  unit: {
    type: String,
    // Not required, so you can omit `required: true`
  },
  water: {
    type: Number,
    // Not required, so you can omit `required: true`
  },
  vitaminD: {
    type: Number,
    required: true 
    // Not required, so you can omit `required: true`
  },
  omega3FattyAcid: {
    type: Number,
    required: true 
    // Not required, so you can omit `required: true`
  },
  vitaminB12: {
    type: Number,
    required: true 
    // Not required, so you can omit `required: true`
  },
  fiber: {
    type: Number,
    required: true 
    // Not required, so you can omit `required: true`
  },
  vitE: {
    type: Number,
    required: true 
    // Not required, so you can omit `required: true`
  },
  calcium: {
    type: Number,
    // Not required, so you can omit `required: true`
  },
  iron: {
    type: Number,
    required: true 
    // Not required, so you can omit `required: true`
  },
  magnesium: {
    type: Number,
    required: true 
    // Not required, so you can omit `required: true`
  },
  potassium: {
    type: Number,
    required: true 
    // Not required, so you can omit `required: true`
  },
  image: {
    type: String, // URL or file path to the image
},
});

module.exports = mongoose.model('Food', foodSchema);
