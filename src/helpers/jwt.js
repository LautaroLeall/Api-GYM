const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'supersecretkey';
const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Sign a JWT token with the given payload.
 * @param {Object} payload Payload to embed in the token
 * @param {Object} [options] Additional sign options
 * @returns {String} Signed JWT
 */
function signToken (payload, options = {}) {
  return jwt.sign(payload, secret, { expiresIn, ...options });
}

/**
 * Verify a JWT token and return the decoded payload.
 * @param {String} token JWT token
 * @returns {Object} Decoded payload
 */
function verifyToken (token) {
  return jwt.verify(token, secret);
}

module.exports = { signToken, verifyToken };