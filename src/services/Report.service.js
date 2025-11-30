const Booking = require('../models/Booking.model');
const Class = require('../models/Class.model');
const Membership = require('../models/Membership.model');
const Payment = require('../models/Payment.model');

async function getClassOccupancy () {
  // Returns occupancy for each class and date
  const pipeline = [
    {
      $match: { status: 'reserved' }
    },
    {
      $group: {
        _id: { class: '$class', date: '$date' },
        reservations: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'classes',
        localField: '_id.class',
        foreignField: '_id',
        as: 'classInfo'
      }
    },
    {
      $unwind: '$classInfo'
    },
    {
      $project: {
        _id: 0,
        classId: '$classInfo._id',
        className: '$classInfo.name',
        date: '$_id.date',
        reservations: 1,
        maxCapacity: '$classInfo.maxCapacity'
      }
    },
    {
      $sort: { date: 1 }
    }
  ];
  return Booking.aggregate(pipeline);
}

async function getMembershipStats () {
  // Count active and inactive memberships by type
  const pipeline = [
    {
      $group: {
        _id: { type: '$type', isActive: '$isActive' },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.type',
        stats: {
          $push: {
            k: { $cond: ['$_id.isActive', 'active', 'inactive'] },
            v: '$count'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        type: '$_id',
        stats: { $arrayToObject: '$stats' }
      }
    }
  ];
  return Membership.aggregate(pipeline);
}

async function getTopClasses (limit = 5) {
  const pipeline = [
    {
      $match: { status: 'reserved' }
    },
    {
      $group: {
        _id: '$class',
        reservations: { $sum: 1 }
      }
    },
    {
      $sort: { reservations: -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'classes',
        localField: '_id',
        foreignField: '_id',
        as: 'classInfo'
      }
    },
    {
      $unwind: '$classInfo'
    },
    {
      $project: {
        _id: 0,
        classId: '$classInfo._id',
        className: '$classInfo.name',
        reservations: 1
      }
    }
  ];
  return Booking.aggregate(pipeline);
}

async function getRevenueByMonth () {
  // Group payments by year-month using Payment model
  const pipeline = [
    { $match: { status: 'success' } },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ];
  return Payment.aggregate(pipeline);
}

module.exports = { getClassOccupancy, getMembershipStats, getTopClasses, getRevenueByMonth };