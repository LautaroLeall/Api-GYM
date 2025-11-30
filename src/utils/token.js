const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken.model');

/*
 * Helpers para gestionar tokens de acceso y refresco.
 *
 * Se define una TTL por defecto para el acceso (JWT_EXPIRES_IN) y para
 * el token de refresco (REFRESH_TOKEN_EXPIRES_IN_SEC).  Los refresh tokens
 * se almacenan con un hash sha256 para evitar guardar el token plano.
 */

const ACCESS_TTL = process.env.JWT_EXPIRES_IN || '15m';
// Por defecto, 7 días en segundos
const REFRESH_TTL_SEC = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_SEC, 10) || (60 * 60 * 24 * 7);

/**
 * Calcula el hash sha256 de un token.
 * @param {string} token
 * @returns {string}
 */
function hashToken (token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Genera un identificador único (jti) para el refresh token.
 * @returns {string}
 */
function createJti () {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Firma un JWT de acceso con duración corta.
 * @param {object} user
 * @returns {string}
 */
function signAccessToken (user) {
  const payload = { id: user._id.toString(), role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: ACCESS_TTL });
}

/**
 * Firma un refresh token con su jti.  Se usa un secreto distinto.
 * @param {object} user
 * @param {string} jti
 * @returns {string}
 */
function signRefreshToken (user, jti) {
  const payload = { id: user._id.toString(), jti };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || 'refreshsecret', { expiresIn: REFRESH_TTL_SEC });
}

/**
 * Guarda el refresh token (hash) en la base de datos junto con sus metadatos.
 * @param {object} param0
 */
async function persistRefreshToken ({ user, refreshToken, jti, ip, userAgent }) {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SEC * 1000);
  await RefreshToken.create({
    user: user._id,
    tokenHash,
    jti,
    expiresAt,
    ip,
    userAgent
  });
}

/**
 * Rota un token de refresco existente: revoca el antiguo y crea uno nuevo.
 * @param {object} oldDoc Documento del refresh token a rotar
 * @param {object} user Usuario asociado
 * @param {object} req Petición Express
 * @returns {object} Nuevos tokens
 */
async function rotateRefreshToken (oldDoc, user, req) {
  oldDoc.revokedAt = new Date();
  const newJti = createJti();
  oldDoc.replacedBy = newJti;
  await oldDoc.save();
  const newAccess = signAccessToken(user);
  const newRefresh = signRefreshToken(user, newJti);
  await persistRefreshToken({
    user,
    refreshToken: newRefresh,
    jti: newJti,
    ip: req.ip,
    userAgent: req.headers['user-agent'] || ''
  });
  return { accessToken: newAccess, refreshToken: newRefresh };
}

module.exports = {
  hashToken,
  createJti,
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  rotateRefreshToken
};