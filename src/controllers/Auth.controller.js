const { body } = require('express-validator');
const { register, login } = require('../services/Auth.service');

// Validation rules
const registerValidators = [
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role').optional().isIn(['client', 'instructor', 'admin']).withMessage('Rol inválido')
];

const loginValidators = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida')
];

async function registerController (req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await register({ name, email, password, role });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

async function loginController (req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await login({ email, password });
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

module.exports = { registerValidators, loginValidators, registerController, loginController };