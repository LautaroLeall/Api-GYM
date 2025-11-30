const User = require('../models/User.model');

async function getAllUsers () {
  return User.find().select('-passwordHash');
}

async function getUserById (id) {
  return User.findById(id).select('-passwordHash');
}

async function updateUser (id, updates) {
  const allowedFields = ['name', 'email', 'role', 'status'];
  const updateData = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) updateData[key] = updates[key];
  }
  const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash');
  if (!user) throw new Error('Usuario no encontrado');
  return user;
}

module.exports = { getAllUsers, getUserById, updateUser };