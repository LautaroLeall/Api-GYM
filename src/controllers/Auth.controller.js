const { body } = require('express-validator');
const { register, login, refresh, logout } = require('../services/Auth.service');

// Validation rules
const registerValidators = [
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role').optional().isIn(['client', 'instructor', 'admin', 'manager']).withMessage('Rol inválido')
];

const loginValidators = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida')
];

// Validator para refresh/logout
const refreshValidators = [
  body('refreshToken').notEmpty().withMessage('Refresh token requerido')
];

async function registerController (req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const { user, accessToken, refreshToken } = await register({ name, email, password, role, ip: req.ip, userAgent: req.headers['user-agent'] });
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

async function loginController (req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await login({ email, password, ip: req.ip, userAgent: req.headers['user-agent'] });
    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

async function refreshController (req, res, next) {
  try {
    const { refreshToken } = req.body;
    const { user, accessToken, refreshToken: newRefresh } = await refresh({ refreshToken, ip: req.ip, userAgent: req.headers['user-agent'], req });
    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken: newRefresh
    });
  } catch (err) {
    err.status = 401;
    next(err);
  }
}

async function logoutController (req, res, next) {
  try {
    const { refreshToken } = req.body;
    await logout({ refreshToken });
    res.status(200).json({ message: 'Sesión cerrada' });
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

module.exports = {
  registerValidators,
  loginValidators,
  refreshValidators,
  registerController,
  loginController,
  refreshController,
  logoutController
};