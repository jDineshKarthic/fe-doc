const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      default: true,
    },
    address: {
      type: String,
      default: true,
    },
    specialization: {
      type: String,
      default: true,
    },
    experience: {
      type: String,
      default: true,
    },
    feePerConsultation: {
      type: Number,
      default: true,
    },
    timings: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model('doctors', doctorSchema);

module.exports = doctorModel;
