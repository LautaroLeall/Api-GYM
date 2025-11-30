const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createPaymentValidators,
  createPaymentController,
  listPaymentsController,
  getPaymentsByUserController
} = require('../controllers/Payment.controller');

// Create payment (admin only)
router.post('/', authenticate, authorize('admin'), createPaymentValidators, validate, createPaymentController);

// List all payments (admin)
router.get('/', authenticate, authorize('admin'), listPaymentsController);

// Get payments by user
router.get('/user/:userId', authenticate, (req, res, next) => {
  // Allow if admin or user is owner
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
    return res.status(403).json({ message: 'No tienes permiso' });
  }
  return getPaymentsByUserController(req, res, next);
});

module.exports = router;