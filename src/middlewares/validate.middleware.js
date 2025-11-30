const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors from express-validator.
 * If there are errors, returns 400 with array of messages.
 */
function validate (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
  }
  next();
}

module.exports = validate;