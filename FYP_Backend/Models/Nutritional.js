

const mongoose = require('mongoose');

const nutritionalSchema = new mongoose.Schema({
    n_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nutrient', // Reference to the Nutrient schema
    },
    m_daily_nutritions: { type: String, required: false }, // Optional field for male daily nutrition
    f_daily_nutritions: { type: String, required: false }, // Optional field for female daily nutrition
    age: { type: String, required: true }, // Age range
    Group: { type: String, required: true } // Age group for categorization
});

// Create and export the model
const Nutritional = mongoose.model('Nutritional', nutritionalSchema);
module.exports = Nutritional;
