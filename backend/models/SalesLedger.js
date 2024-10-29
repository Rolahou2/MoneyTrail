const mongoose = require('mongoose');
const ProductPricing = require('./ProductPricing'); // Reference to ProductPricing model

// Define the schema
const salesLedgerSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  type: {
    type: String,
    enum: ['B2B', 'B2C'],
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductPricing', // Reference to the ProductPricing model
    required: true
  },
  SoldInBottle:{
    type: String,
    enum: ['yes','no'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPriceInLL: {
    type: Number,
    required: true,
    min: 0,
  },
  profitPerUnitInLL: {
    type: Number,
    required: true,
    min: 0,
  }
});

salesLedgerSchema.pre('save', async function (next) {
    const product = await ProductPricing.findById(this.product);
    if (product) {
      // Choose the appropriate `unitPriceInLL` based on `SoldInBottle` status
      this.unitPriceInLL = this.SoldInBottle === 'yes' ? product.unitPriceInLLBottle : product.unitPriceInLLNotBottle;
      
      // Calculate profit based on chosen unit price
      this.profitPerUnitInLL = this.SoldInBottle === 'yes' ? product.profitPerUnitInLLBottle : product.profitPerUnitInLLNotBottle;
    }
    next();
  });

salesLedgerSchema.virtual('PaymentinLL').get(function() {
    return this.unitPriceInLL * this.quantity;
  });

salesLedgerSchema.virtual('TotalProfitinLL').get(function() {
    return this.ProfitperUnitInLL * this.quantity;
  });

// Ensure virtual fields are serialized when sending JSON
salesLedgerSchema.set('toJSON', { virtuals: true });
salesLedgerSchema.set('toObject', { virtuals: true });

// Compile and export the model
module.exports = mongoose.model('SalesLedger', salesLedgerSchema);
