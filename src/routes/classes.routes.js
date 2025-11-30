const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createClassValidators,
  updateClassValidators,
  createClassController,
  listClassesController,
  getClassController,
  updateClassController
} = require('../controllers/Class.controller');

// Create class (admin)
router.post('/', authenticate, authorize('admin'), createClassValidators, validate, createClassController);

// List classes (public)
router.get('/', listClassesController);

// Get class by id (public)
router.get('/:id', getClassController);

// Update class (admin)
router.put('/:id', authenticate, authorize('admin'), updateClassValidators, validate, updateClassController);

module.exports = router;