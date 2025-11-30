const { body, param } = require('express-validator');
const { createClass, getAllClasses, getClassById, updateClass } = require('../services/Class.service');

// Validators
const createClassValidators = [
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('description').optional().isString(),
  body('instructorId').isMongoId().withMessage('Instructor inválido'),
  body('maxCapacity').isInt({ min: 1 }).withMessage('Capacidad inválida'),
  body('schedule').isArray({ min: 1 }).withMessage('Schedule requerido'),
  body('schedule.*.day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).withMessage('Día inválido'),
  body('schedule.*.time').notEmpty().withMessage('Hora requerida')
];

const updateClassValidators = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('name').optional().notEmpty(),
  body('description').optional().isString(),
  body('instructor').optional().isMongoId(),
  body('maxCapacity').optional().isInt({ min: 1 }),
  body('schedule').optional().isArray({ min: 1 }),
  body('schedule.*.day').optional().isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  body('schedule.*.time').optional().notEmpty()
];

async function createClassController (req, res, next) {
  try {
    const { name, description, instructorId, maxCapacity, schedule } = req.body;
    const classItem = await createClass({ name, description, instructorId, maxCapacity, schedule });
    res.status(201).json(classItem);
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

async function listClassesController (req, res, next) {
  try {
    const classes = await getAllClasses();
    res.json(classes);
  } catch (err) {
    next(err);
  }
}

async function getClassController (req, res, next) {
  try {
    const classItem = await getClassById(req.params.id);
    res.json(classItem);
  } catch (err) {
    err.status = 404;
    next(err);
  }
}

async function updateClassController (req, res, next) {
  try {
    const classItem = await updateClass(req.params.id, req.body);
    res.json(classItem);
  } catch (err) {
    err.status = 400;
    next(err);
  }
}

module.exports = {
  createClassValidators,
  updateClassValidators,
  createClassController,
  listClassesController,
  getClassController,
  updateClassController
};