const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Family Member Schema
const familyMemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City', // Reference to the Nutrient schema
  },
  dob: {
    type: Date,
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: ['Married', 'Unmarried', 'Divorced', 'Widowed'],
    required: true,
  },
  lactationStatus: {
    type: String,
    enum: ['Pregnancy', 'Lactation', 'None'],
    default: 'None',
  },
  familyStatus: {
    type: String,
    enum: ['Father', 'Mother', 'Brother', 'Sister', 'Wife', 'Husband', 'Son', 'Daughter'],
    required: true,
  },
  userid:
  {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Create the FamilyMember model
const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);

module.exports = FamilyMember;
