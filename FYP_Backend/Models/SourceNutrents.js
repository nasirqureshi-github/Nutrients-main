const mongoose = require('mongoose');

// Define the nutritional schema
const nutritionalSchema = new mongoose.Schema({


    nid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nutrient', // Reference to the Nutrient schema
    },

    name: {
        type: String,
        required: true // Required field for name
    },

    unit: {
        type: String,
        required: true,
        enum: ['mg', 'liter', 'kg', 'dozen'] // Enum for unit types
    },

    prices: [{
        province: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Province', // Reference to the Province schema
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],

    image: {
        type: String,
        required: true // Required field for image URL
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Create and export the model
const SourceNutritional = mongoose.model('SourceNutritional', nutritionalSchema);
module.exports = SourceNutritional;
