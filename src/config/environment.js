/*
 * Environment configuration
 *
 * Loads environment variables from .env file using dotenv. For security
 * reasons, sensitive values like JWT secret and database connection
 * strings should be kept out of version control (see .env.example).
 */

const dotenv = require('dotenv');

function loadEnv () {
  // Only load .env file in non-production environments
  const result = dotenv.config();
  if (result.error && process.env.NODE_ENV !== 'production') {
    console.warn('Could not load .env file:', result.error.message);
  }
}

module.exports = { loadEnv };