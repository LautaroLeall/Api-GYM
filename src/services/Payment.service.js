const Payment = require('../models/Payment.model');
const Membership = require('../models/Membership.model');

async function createPayment ({ userId, membershipId, amount, method, status = 'success' }) {
  const payment = await Payment.create({ user: userId, membership: membershipId, amount, method, status });
  // Activate membership on successful payment
  if (status === 'success') {
    await Membership.findByIdAndUpdate(membershipId, { isActive: true });
  }
  return payment;
}

async function getPaymentsByUser (userId) {
  return Payment.find({ user: userId }).populate('membership');
}

async function getAllPayments () {
  return Payment.find().populate('user', 'name email');
}

async function getRevenueByMonth () {
  // Group payments by year-month and sum amount
  const pipeline = [
    {
      $match: {
        status: 'success'
      }
    },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ];
  return Payment.aggregate(pipeline);
}

module.exports = { createPayment, getPaymentsByUser, getAllPayments, getRevenueByMonth };