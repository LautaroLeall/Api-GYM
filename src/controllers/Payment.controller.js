const { body, param } = require('express-validator');
const { createPayment, getPaymentsByUser, getAllPayments } = require('../services/Payment.service');

// Validators
const createPaymentValidators = [
  body('userId').isMongoId().withMessage('Usuario inválido'),
  body('membershipId').isMongoId().withMessage('Membresía inválida'),
  body('amount').isFloat({ gt: 0 }).withMessage('Monto inválido'),
  body('method').optional().isIn(['efectivo', 'tarjeta', 'transferencia']).withMessage('Método inválido'),
  body('status').optional().isIn(['success', 'failed']).withMessage('Estado inválido')
];

async function createPaymentController (req, res, next) {
  try {
    const { userId, membershipId, amount, method, status } = req.body;
    const payment = await createPayment({ userId, membershipId, amount, method, status });
    res.status(201).json(payment);
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

async function listPaymentsController (req, res, next) {
  try {
    const payments = await getAllPayments();
    res.json(payments);
  } catch (err) {
    next(err);
  }
}

async function getPaymentsByUserController (req, res, next) {
  try {
    const payments = await getPaymentsByUser(req.params.userId);
    res.json(payments);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPaymentValidators,
  createPaymentController,
  listPaymentsController,
  getPaymentsByUserController
};