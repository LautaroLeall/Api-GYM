const { query } = require('express-validator');
const {
  getClassOccupancy,
  getMembershipStats,
  getTopClasses,
  getRevenueByMonth
} = require('../services/Report.service');

const topClassesValidators = [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Límite inválido')
];

async function classOccupancyController (req, res, next) {
  try {
    const data = await getClassOccupancy();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function membershipStatsController (req, res, next) {
  try {
    const data = await getMembershipStats();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function topClassesController (req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    const data = await getTopClasses(limit);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function revenueByMonthController (req, res, next) {
  try {
    const data = await getRevenueByMonth();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  topClassesValidators,
  classOccupancyController,
  membershipStatsController,
  topClassesController,
  revenueByMonthController
};