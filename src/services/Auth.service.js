const User = require('../models/User.model');
const { signToken } = require('../helpers/jwt');

async function register ({ name, email, password, role }) {
  // Check if email exists
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('El email ya está registrado');
  }
  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role });
  const token = signToken({ id: user._id, role: user.role });
  return { user, token };
}

async function login ({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }
  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new Error('Credenciales inválidas');
  }
  if (user.status !== 'active') {
    throw new Error('Usuario no activo');
  }
  const token = signToken({ id: user._id, role: user.role });
  return { user, token };
}

module.exports = { register, login };