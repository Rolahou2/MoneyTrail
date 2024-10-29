const mongoose = require('mongoose');
const ProductPricing = require('./ProductPricing'); // Reference to ProductPricing model
const SalesLedger = require('./SalesLedger');       // Reference to SalesLedger model

// Define the schema
const finishedGoodsInventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductPricing', // Reference to ProductPricing to get ProductName and ProductID
    required: true,
  },
  ProductName: {
    type: String,
    required: true,
  },
  ProductID: {
    type: String,
    required: true,
  },
  CurrentBottlesInStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  CurrentLitresInStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  CurrentLitresSold: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  CurrentBottlesSold: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  TotalProduction: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  }
});

// Virtual to calculate TotalProduction as CurrentLitresSold + CurrentBottlesInStock
finishedGoodsInventorySchema.virtual('TotalProduction').get(function() {
  return this.CurrentLitresSold + this.CurrentBottlesInStock;
});

// Ensure virtual fields are serialized when sending JSON
finishedGoodsInventorySchema.set('toJSON', { virtuals: true });
finishedGoodsInventorySchema.set('toObject', { virtuals: true });

// Pre-save hook to populate ProductName and ProductID from ProductPricing
finishedGoodsInventorySchema.pre('save', async function(next) {
  const product = await ProductPricing.findById(this.product);
  if (product) {
    this.ProductName = product.ProductName;
    this.ProductID = product.ProductID;
  }
  next();
});

// Method to update inventory based on sales ledger data
finishedGoodsInventorySchema.statics.updateInventory = async function(productId) {
  const inventory = await this.findOne({ product: productId });
  if (!inventory) {
    throw new Error('Inventory record not found for this product.');
  }

  // Calculate CurrentLitresSold and CurrentBottlesSold from SalesLedger
  const sales = await SalesLedger.find({ product: productId });

  let litresSold = 0;
  let bottlesSold = 0;
  sales.forEach(sale => {
    if (sale.SoldInBottle === 'yes') {
      bottlesSold += sale.quantity;
    } else {
      litresSold += sale.quantity;
    }
  });

  inventory.CurrentLitresSold = litresSold;
  inventory.CurrentBottlesSold = bottlesSold;
  inventory.TotalProduction = bottlesSold + inventory.CurrentBottlesInStock;

  await inventory.save();
};

// Compile and export the model
module.exports = mongoose.model('FinishedGoodsInventory', finishedGoodsInventorySchema);
