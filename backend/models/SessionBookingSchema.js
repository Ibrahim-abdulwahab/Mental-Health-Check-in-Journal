const mongoose = require('mongoose');

const SessionBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedDate: {
    type: Date,
    required: true
  },
  requestedDuration: {
    type: Number, // in minutes
    required: true
  },
  mode: {
    type: String,
    enum: ['chat', 'video', 'in-person'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('SessionBooking', SessionBookingSchema);
