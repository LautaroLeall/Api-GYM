const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createBookingValidators,
  cancelBookingValidators,
  createBookingController,
  cancelBookingController,
  listBookingsByUserController,
  listBookingsByClassController
} = require('../controllers/Booking.controller');

// Create booking (must be authenticated as client)
router.post('/', authenticate, authorize('client', 'admin'), createBookingValidators, validate, createBookingController);

// Cancel booking (owner only)
router.delete('/:id', authenticate, authorize('client', 'admin'), cancelBookingValidators, validate, cancelBookingController);

// Get bookings by user
router.get('/user/:userId', authenticate, (req, res, next) => {
  // Only admin or owner can view
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
    return res.status(403).json({ message: 'No tienes permiso' });
  }
  return listBookingsByUserController(req, res, next);
});

// Get bookings by class (admin only)
router.get('/class/:classId', authenticate, authorize('admin'), listBookingsByClassController);

module.exports = router;