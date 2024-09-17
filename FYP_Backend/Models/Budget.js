const mongoose = require('mongoose');

// Define the Budget schema
const budgetSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Item collection
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyMember', // Reference to the Item collection
    },
    usertype: {
        type: String,
    },
    date_: {
        type: String,
    },
    prices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price' // Reference to the Price collection
    }]
});

// Create Mongoose models
const Budget = mongoose.model('Budget', budgetSchema);

// Export the model
module.exports = Budget;
