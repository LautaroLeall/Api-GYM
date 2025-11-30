/**
 * Authorization middleware.
 * Checks if the authenticated user has one of the allowed roles.
 * Usage: role('admin'), role('instructor', 'admin')
 */
function authorize (...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso' });
    }
    next();
  };
}

module.exports = authorize;