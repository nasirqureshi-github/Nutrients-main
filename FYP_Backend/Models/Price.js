const mongoose = require('mongoose');

// Define the schema
const PriceSchema = new mongoose.Schema({
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food', // Reference to the Source collection
        required: true,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City', // Reference to the City collection
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        enum: ['g', 'dozen'], // You can add more units here
        required: true,
    },
   
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Create the model from the schema
const Price = mongoose.model('Price', PriceSchema);

module.exports = Price;
