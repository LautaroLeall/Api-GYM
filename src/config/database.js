/*
 * MongoDB connection helper
 *
 * Uses mongoose to connect to the database. Exports a function
 * connectDB() that returns a promise resolved when the connection
 * succeeds. Connection details are read from process.env.MONGO_URI.
 */

const mongoose = require('mongoose');

async function connectDB () {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/gym';
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  await mongoose.connect(uri, options);
}

module.exports = connectDB;