const Booking = require('../models/Booking.model');
const Class = require('../models/Class.model');
const Membership = require('../models/Membership.model');

async function createBooking ({ userId, classId, date }) {
  // Validate membership active on date
  const membership = await Membership.findOne({ user: userId, isActive: true, startDate: { $lte: date }, endDate: { $gte: date } });
  if (!membership) {
    throw new Error('Membresía no activa o vencida');
  }
  // Validate class
  const classItem = await Class.findById(classId);
  if (!classItem) throw new Error('Clase no encontrada');
  // Prevent duplicate booking
  const exists = await Booking.findOne({ user: userId, class: classId, date, status: 'reserved' });
  if (exists) {
    throw new Error('Ya tienes una reserva para esta clase y horario');
  }
  // Check capacity
  const count = await Booking.countDocuments({ class: classId, date, status: 'reserved' });
  if (count >= classItem.maxCapacity) {
    throw new Error('No quedan cupos disponibles para esta clase');
  }
  // Create booking
  const booking = await Booking.create({ user: userId, class: classId, date, status: 'reserved' });
  return booking;
}

async function cancelBooking (bookingId, userId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Reserva no encontrada');
  if (booking.user.toString() !== userId.toString()) {
    throw new Error('No puedes cancelar esta reserva');
  }
  booking.status = 'cancelled';
  await booking.save();
  return booking;
}

async function getBookingsByUser (userId) {
  return Booking.find({ user: userId }).populate('class');
}

async function getBookingsByClass (classId) {
  return Booking.find({ class: classId }).populate('user', 'name email');
}

module.exports = { createBooking, cancelBooking, getBookingsByUser, getBookingsByClass };