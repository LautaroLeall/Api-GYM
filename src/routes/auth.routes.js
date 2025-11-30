const express = require('express');
const router = express.Router();

const validate = require('../middlewares/validate.middleware');
const {
  registerValidators,
  loginValidators,
  refreshValidators,
  registerController,
  loginController,
  refreshController,
  logoutController
} = require('../controllers/Auth.controller');

// Registro
router.post('/register', registerValidators, validate, registerController);

// Login
router.post('/login', loginValidators, validate, loginController);

// Refresh token
router.post('/refresh', refreshValidators, validate, refreshController);

// Logout
router.post('/logout', refreshValidators, validate, logoutController);

module.exports = router;