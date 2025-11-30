const { verifyToken } = require('../helpers/jwt');
const User = require('../models/User.model');

/**
 * Authentication middleware.
 * Verifies the Authorization header (Bearer token) and attaches
 * the authenticated user to req.user. If verification fails,
 * responds with 401 Unauthorized.
 */
async function authenticate (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token requerido' });
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Usuario no autorizado' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = authenticate;