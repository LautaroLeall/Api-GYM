const { body, param } = require('express-validator');
const { createBooking, cancelBooking, getBookingsByUser, getBookingsByClass } = require('../services/Booking.service');

// Validators
const createBookingValidators = [
  body('classId').isMongoId().withMessage('Clase inválida'),
  body('date').isISO8601().withMessage('Fecha inválida')
];

const cancelBookingValidators = [
  param('id').isMongoId().withMessage('ID inválido')
];

async function createBookingController (req, res, next) {
  try {
    const { classId, date } = req.body;
    const booking = await createBooking({ userId: req.user._id, classId, date: new Date(date) });
    res.status(201).json(booking);
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

async function cancelBookingController (req, res, next) {
  try {
    const booking = await cancelBooking(req.params.id, req.user._id);
    res.json(booking);
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

async function listBookingsByUserController (req, res, next) {
  try {
    const bookings = await getBookingsByUser(req.params.userId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

async function listBookingsByClassController (req, res, next) {
  try {
    const bookings = await getBookingsByClass(req.params.classId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBookingValidators,
  cancelBookingValidators,
  createBookingController,
  cancelBookingController,
  listBookingsByUserController,
  listBookingsByClassController
};