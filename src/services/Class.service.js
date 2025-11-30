const Class = require('../models/Class.model');
const User = require('../models/User.model');

async function createClass ({ name, description, instructorId, maxCapacity, schedule }) {
  // Validate instructor is an instructor role
  const instructor = await User.findById(instructorId);
  if (!instructor || instructor.role !== 'instructor') {
    throw new Error('Instructor inválido');
  }
  const classItem = await Class.create({ name, description, instructor: instructorId, maxCapacity, schedule });
  return classItem;
}

async function getAllClasses () {
  return Class.find().populate('instructor', 'name email');
}

async function getClassById (id) {
  const classItem = await Class.findById(id).populate('instructor', 'name email');
  if (!classItem) throw new Error('Clase no encontrada');
  return classItem;
}

async function updateClass (id, updates) {
  const allowed = ['name', 'description', 'instructor', 'maxCapacity', 'schedule'];
  const data = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) data[key] = updates[key];
  }
  const classItem = await Class.findByIdAndUpdate(id, data, { new: true });
  if (!classItem) throw new Error('Clase no encontrada');
  return classItem;
}

module.exports = { createClass, getAllClasses, getClassById, updateClass };