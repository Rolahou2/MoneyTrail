const express = require('express');
const router = express.Router();
const SalesLedger = require('../models/SalesLedger');

// Create a new sale entry
router.post('/', async (req, res) => {
  try {
    const sale = new SalesLedger(req.body);
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all sales
router.get('/', async (req, res) => {
  try {
    const sales = await SalesLedger.find();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a sale entry
router.put('/:id', async (req, res) => {
  try {
    const sale = await SalesLedger.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a sale entry
router.delete('/:id', async (req, res) => {
  try {
    await SalesLedger.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
