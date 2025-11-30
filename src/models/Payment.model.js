const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia'],
    default: 'tarjeta'
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success'
  }
}, {
  timestamps: true
});

// Índice para optimizar consultas por usuario, membresía y estado
paymentSchema.index({ user: 1, membership: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);