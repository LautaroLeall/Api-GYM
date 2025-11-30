const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createMembershipValidators,
  updateMembershipStatusValidators,
  createMembershipController,
  listMembershipsController,
  getMembershipsByUserController,
  updateMembershipStatusController
} = require('../controllers/Membership.controller');

// Create membership (admin)
router.post('/', authenticate, authorize('admin'), createMembershipValidators, validate, createMembershipController);

// List all memberships (admin)
router.get('/', authenticate, authorize('admin'), listMembershipsController);

// Get memberships by user (admin)
router.get('/user/:userId', authenticate, authorize('admin'), getMembershipsByUserController);

// Update membership status (admin)
router.patch('/:id/status', authenticate, authorize('admin'), updateMembershipStatusValidators, validate, updateMembershipStatusController);

module.exports = router;