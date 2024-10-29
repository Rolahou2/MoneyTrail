const express = require('express');
const router = express.Router();
const SalesLedger = require('../models/SalesLedger'); // Reference to SalesLedger model

// Helper function to format date ranges
const formatDateRange = (startDate, endDate) => ({
  start: startDate.toISOString().split('T')[0],
  end: endDate.toISOString().split('T')[0],
});

// Route to get weekly sales summary
router.get('/weekly-sales-summary', async (req, res) => {
  try {
    const sales = await SalesLedger.aggregate([
      {
        $group: {
          _id: { week: { $week: "$date" }, year: { $year: "$date" } },
          totalSold: { $sum: "$quantity" },
          amountLL: { $sum: "$unitPriceInLL" },
          amountUSD: { $sum: "$unitPriceInUSD" },
        },
      },
      {
        $project: {
          _id: 0,
          week: "$_id.week",
          year: "$_id.year",
          totalSold: 1,
          amountLL: 1,
          amountUSD: 1,
        },
      },
    ]);
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch weekly sales summary" });
  }
});

// Route to get monthly sales summary
router.get('/monthly-sales-summary', async (req, res) => {
  try {
    const sales = await SalesLedger.aggregate([
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          totalSold: { $sum: "$quantity" },
          amountLL: { $sum: "$unitPriceInLL" },
          amountUSD: { $sum: "$unitPriceInUSD" },
          profitLL: { $sum: "$profitPerUnitInLL" },
          profitUSD: { $sum: "$profitPerUnitInUSD" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalSold: 1,
          amountLL: 1,
          amountUSD: 1,
          profitLL: 1,
          profitUSD: 1,
        },
      },
    ]);
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch monthly sales summary" });
  }
});

module.exports = router;
