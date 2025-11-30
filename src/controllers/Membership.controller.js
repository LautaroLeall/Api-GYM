const { body, param } = require('express-validator');
const { createMembership, getMembershipsByUser, getAllMemberships, updateMembershipStatus } = require('../services/Membership.service');

// Validators
const createMembershipValidators = [
  body('userId').isMongoId().withMessage('Usuario inválido'),
  body('type').isIn(['mensual', 'anual', 'premium']).withMessage('Tipo inválido'),
  body('price').isFloat({ gt: 0 }).withMessage('Precio inválido'),
  body('startDate').optional().isISO8601().withMessage('Fecha de inicio inválida')
];

const updateMembershipStatusValidators = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('isActive').isBoolean().withMessage('Estado inválido')
];

async function createMembershipController (req, res, next) {
  try {
    const { userId, type, price, startDate } = req.body;
    const membership = await createMembership({ userId, type, startDate: startDate ? new Date(startDate) : new Date(), price });
    res.status(201).json(membership);
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

async function listMembershipsController (req, res, next) {
  try {
    const memberships = await getAllMemberships();
    res.json(memberships);
  } catch (err) {
    next(err);
  }
}

async function getMembershipsByUserController (req, res, next) {
  try {
    const memberships = await getMembershipsByUser(req.params.userId);
    res.json(memberships);
  } catch (err) {
    next(err);
  }
}

async function updateMembershipStatusController (req, res, next) {
  try {
    const membership = await updateMembershipStatus(req.params.id, req.body.isActive);
    res.json(membership);
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

module.exports = {
  createMembershipValidators,
  updateMembershipStatusValidators,
  createMembershipController,
  listMembershipsController,
  getMembershipsByUserController,
  updateMembershipStatusController
};