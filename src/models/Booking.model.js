const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['reserved', 'cancelled', 'completed'],
    default: 'reserved'
  }
}, {
  timestamps: true
});

// Índices para optimizar búsquedas por clase y fecha
bookingSchema.index({ class: 1, date: 1, status: 1 });
bookingSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Booking', bookingSchema);