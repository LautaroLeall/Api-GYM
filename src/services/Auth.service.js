const User = require('../models/User.model');
const RefreshToken = require('../models/RefreshToken.model');
const {
  createJti,
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  rotateRefreshToken,
  hashToken
} = require('../utils/token');

/**
 * Registro de usuario.
 * Crea un usuario con el rol indicado y devuelve tokens de acceso y refresco.
 * @param {Object} param0
 */

async function register ({ name, email, password, role, ip, userAgent }) {
  // Verificar que no exista un usuario con el mismo email
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('El email ya está registrado');
  }
  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role });
  // Emitir tokens de acceso y refresco
  const accessToken = signAccessToken(user);
  const jti = createJti();
  const refreshToken = signRefreshToken(user, jti);
  await persistRefreshToken({
    user,
    refreshToken,
    jti,
    ip,
    userAgent
  });
  return { user, accessToken, refreshToken };
}

async function login ({ email, password, ip, userAgent }) {
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
  const accessToken = signAccessToken(user);
  const jti = createJti();
  const refreshToken = signRefreshToken(user, jti);
  await persistRefreshToken({
    user,
    refreshToken,
    jti,
    ip,
    userAgent
  });
  return { user, accessToken, refreshToken };
}

/**
 * Refresca un par de tokens usando un refresh token proporcionado.
 * @param {Object} param0
 */
async function refresh ({ refreshToken, ip, userAgent, req }) {
  // Decodificar el refresh token para obtener jti y user id
  let decoded;
  try {
    decoded = require('jsonwebtoken').verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refreshsecret');
  } catch (err) {
    throw new Error('Refresh token inválido');
  }
  const { id, jti } = decoded;
  const tokenHash = hashToken(refreshToken);
  const tokenDoc = await RefreshToken.findOne({ tokenHash, jti }).populate('user');
  if (!tokenDoc) {
    throw new Error('Refresh token no reconocido');
  }
  if (tokenDoc.revokedAt) {
    throw new Error('Refresh token revocado');
  }
  if (tokenDoc.expiresAt < new Date()) {
    throw new Error('Refresh token expirado');
  }
  const user = tokenDoc.user;
  // Rotar el token
  const { accessToken, refreshToken: newRefresh } = await rotateRefreshToken(tokenDoc, user, req);
  return { user, accessToken, refreshToken: newRefresh };
}

/**
 * Revoca un refresh token (logout)
 * @param {Object} param0
 */
async function logout ({ refreshToken }) {
  const tokenHash = hashToken(refreshToken);
  const tokenDoc = await RefreshToken.findOne({ tokenHash });
  if (!tokenDoc) {
    throw new Error('Refresh token no reconocido');
  }
  tokenDoc.revokedAt = new Date();
  await tokenDoc.save();
  return true;
}
module.exports = { register, login, refresh, logout };