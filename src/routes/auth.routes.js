const express = require('express');
const router = express.Router();

const validate = require('../middlewares/validate.middleware');
const {
  registerValidators,
  loginValidators,
  registerController,
  loginController
} = require('../controllers/Auth.controller');

// Registro
router.post('/register', registerValidators, validate, registerController);

// Login
router.post('/login', loginValidators, validate, loginController);

module.exports = router;