const mongoose = require('mongoose');

/**
 * RefreshToken model
 *
 * Cada token de refresco se almacena como un documento con un hash único y
 * un identificador jti.  El hash evita que el token en bruto quede
 * persistido en la base de datos.  También registra cuándo expira,
 * si fue revocado y si fue reemplazado por otro token.
 */
const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  tokenHash: {
    type: String,
    required: true,
    unique: true
  },
  jti: {
    type: String,
    required: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  revokedAt: {
    type: Date,
    default: null
  },
  replacedBy: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ip: String,
  userAgent: String
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);