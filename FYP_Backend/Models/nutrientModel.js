const mongoose = require('mongoose');

const nutrientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Nutrient = mongoose.model('Nutrient', nutrientSchema);

module.exports = Nutrient;
