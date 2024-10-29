const mongoose = require('mongoose');
const Expenses = require('./Expenses'); // Expenses.js
const SalesLedger = require('./SalesLedger'); // Sales ledger model

// Define the schema
const accountingSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    unique: true,
  },
  totalGoods: {
    type: Number,
    default: 0.0,
  },
  regularExpenses: {
    type: Number,
    default: 0.0,
  },
  irregularExpenses: {
    type: Number,
    default: 0.0,
  },
  revenues: {
    type: Number,
    default: 0.0,
  }
});

// Virtual field for Net Profit
accountingSchema.virtual('netProfit').get(function() {
  return this.revenues - (this.totalGoods + this.regularExpenses + this.irregularExpenses);
});

// Static method to calculate expenses and revenues
accountingSchema.statics.calculateMonthlyData = async function(month) {
  const monthStart = new Date(`${month}-01`);
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

  // Calculate Total Goods from Expenses
  const totalGoods = await Expenses.aggregate([
    { $match: { date: { $gte: monthStart, $lte: monthEnd }, category: 'Goods' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]).then(result => (result[0] ? result[0].total : 0));

  // Calculate Regular Expenses
  const regularExpenses = await Expenses.aggregate([
    { $match: { date: { $gte: monthStart, $lte: monthEnd }, category: 'Regular' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]).then(result => (result[0] ? result[0].total : 0));

  // Calculate Irregular Expenses
  const irregularExpenses = await Expenses.aggregate([
    { $match: { date: { $gte: monthStart, $lte: monthEnd }, category: 'Irregular' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]).then(result => (result[0] ? result[0].total : 0));

  // Calculate Revenues from SalesLedger
  const revenues = await SalesLedger.aggregate([
    { $match: { date: { $gte: monthStart, $lte: monthEnd } } },
    { $group: { _id: null, total: { $sum: '$paymentInUSD' } } }
  ]).then(result => (result[0] ? result[0].total : 0));

  // Update or create accounting entry for the month
  let accountingEntry = await this.findOne({ month });
  if (!accountingEntry) {
    accountingEntry = new this({ month });
  }

  accountingEntry.totalGoods = totalGoods;
  accountingEntry.regularExpenses = regularExpenses;
  accountingEntry.irregularExpenses = irregularExpenses;
  accountingEntry.revenues = revenues;

  await accountingEntry.save();
  return accountingEntry;
};

// Compile and export the model
module.exports = mongoose.model('Accounting', accountingSchema);
