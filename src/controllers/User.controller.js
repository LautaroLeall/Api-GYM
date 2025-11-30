const { body, param } = require('express-validator');
const { getAllUsers, getUserById, updateUser } = require('../services/User.service');

// Validators
const updateUserValidators = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('name').optional().notEmpty().withMessage('Nombre inválido'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('role').optional().isIn(['client', 'instructor', 'admin']).withMessage('Rol inválido'),
  body('status').optional().isIn(['active', 'inactive', 'banned']).withMessage('Estado inválido')
];

async function listUsersController (req, res, next) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getUserController (req, res, next) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateUserController (req, res, next) {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

module.exports = { updateUserValidators, listUsersController, getUserController, updateUserController };