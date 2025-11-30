const { addMonths, addYears } = require('date-fns');

/**
 * Calculate membership end date based on type and start date.
 * @param {String} type Type of membership (mensual | anual | premium)
 * @param {Date} startDate Start date of membership
 * @returns {Date} Calculated end date
 */
function calculateEndDate (type, startDate) {
  const start = new Date(startDate);
  if (type === 'mensual') {
    return addMonths(start, 1);
  }
  if (type === 'anual' || type === 'premium') {
    return addYears(start, 1);
  }
  throw new Error(`Tipo de membresía desconocido: ${type}`);
}

module.exports = { calculateEndDate };