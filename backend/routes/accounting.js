const express = require('express');
const router = express.Router();
const Accounting = require('../models/Accounting');

// Retrieve all accounting records
router.get('/', async (req, res) => {
  try {
    const records = await Accounting.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update monthly accounting data
router.post('/calculate/:month', async (req, res) => {
  try {
    const month = req.params.month;
    const accountingEntry = await Accounting.calculateMonthlyData(month);
    res.json(accountingEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
