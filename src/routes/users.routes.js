const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  updateUserValidators,
  listUsersController,
  getUserController,
  updateUserController
} = require('../controllers/User.controller');

// List all users (admin only)
router.get('/', authenticate, authorize('admin'), listUsersController);

// Get user by id (admin)
router.get('/:id', authenticate, authorize('admin'), getUserController);

// Update user
router.put('/:id', authenticate, authorize('admin'), updateUserValidators, validate, updateUserController);

module.exports = router;