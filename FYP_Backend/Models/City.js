// city.model.js
const mongoose = require('mongoose');

// Define the schema
const citySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

// Create the model
const City = mongoose.model('City', citySchema);

// Export the model
module.exports = City;
