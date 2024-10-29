const express = require('express');
const router = express.Router();
const FinishedGoodsInventory = require('../models/FinishedGoods_Inventory');

// Retrieve all finished goods inventory records
router.get('/', async (req, res) => {
  try {
    const inventory = await FinishedGoodsInventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inventory for a specific product
router.put('/:id', async (req, res) => {
  try {
    const inventory = await FinishedGoodsInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
