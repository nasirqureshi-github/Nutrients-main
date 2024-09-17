const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
        // Add validation for password length, format, etc. if needed
    },
    age: {
        type: String,
        required: true
    },
    Areyou: {
        type: String,
        required: true
    },
    DoB: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "User"], // Enum for role with Admin and User
        default: "User"
    },
    verify: {
        type: Boolean,
        default: false
    },
    country: {
        type: String,
        default: "Pakistan"
    },
    Province: {
        type: String,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City', // Reference to the Nutrient schema
    },
    otpCode: {
        type: String
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
