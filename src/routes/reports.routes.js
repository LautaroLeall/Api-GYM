const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  topClassesValidators,
  classOccupancyController,
  membershipStatsController,
  topClassesController,
  revenueByMonthController
} = require('../controllers/Report.controller');

// Class occupancy
router.get('/occupancy', authenticate, authorize('admin'), classOccupancyController);

// Membership stats
router.get('/membership-stats', authenticate, authorize('admin'), membershipStatsController);

// Top classes
router.get('/top-classes', authenticate, authorize('admin'), topClassesValidators, validate, topClassesController);

// Revenue by month
router.get('/revenue', authenticate, authorize('admin'), revenueByMonthController);

module.exports = router;