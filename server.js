/*
 * Entry point of the Gym API.
 *
 * This file sets up the Express application, connects to MongoDB and
 * registers global middleware and routes. Environment variables are
 * loaded from a .env file via dotenv (see src/config/environment.js).
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { loadEnv } = require('./src/config/environment');
const connectDB = require('./src/config/database');

// Load environment variables
loadEnv();

// Create an Express application
const app = express();

// Connect to MongoDB
connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Global middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/users.routes');
const membershipRoutes = require('./src/routes/memberships.routes');
const paymentRoutes = require('./src/routes/payments.routes');
const classRoutes = require('./src/routes/classes.routes');
const bookingRoutes = require('./src/routes/bookings.routes');
const reportRoutes = require('./src/routes/reports.routes');

// Prefix all routes with /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/memberships', membershipRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/reports', reportRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handling middleware
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
