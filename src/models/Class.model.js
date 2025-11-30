const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  time: {
    type: String,
    required: true
  }
}, { _id: false });

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  schedule: [scheduleSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', classSchema);