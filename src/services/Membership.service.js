const Membership = require('../models/Membership.model');
const { calculateEndDate } = require('../helpers/date');

async function createMembership ({ userId, type, startDate = new Date(), price }) {
  const endDate = calculateEndDate(type, startDate);
  const membership = await Membership.create({
    user: userId,
    type,
    startDate,
    endDate,
    price,
    isActive: true
  });
  return membership;
}

async function getMembershipsByUser (userId) {
  return Membership.find({ user: userId });
}

async function getAllMemberships () {
  return Membership.find().populate('user', 'name email');
}

async function updateMembershipStatus (id, isActive) {
  const membership = await Membership.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!membership) throw new Error('Membresía no encontrada');
  return membership;
}

module.exports = { createMembership, getMembershipsByUser, getAllMemberships, updateMembershipStatus };