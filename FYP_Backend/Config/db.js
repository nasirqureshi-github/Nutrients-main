// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
// MongoDB connection URL
const mongoURI = process.env.DB_URL;

// Connect to MongoDB
mongoose.connect(mongoURI);

// Get the default connection
const db = mongoose.connection;

// Event listeners for database connection
db.on('connected', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close(() => {
        console.log('MongoDB connection disconnected through app termination');
        process.exit(0);
    });
});
module.exports = db;
