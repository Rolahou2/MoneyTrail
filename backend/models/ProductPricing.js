const mongoose = require('mongoose');

// Define the schema
const productPricingSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
    trim: true,
  },
  ProductID: {
    type: String,
    required: true,
    unique: true,
  },
  BottleSizeInLitre: {
    type: Number,
    required: true,
    min: 1,
  },
  BottleCost: {
    type: Number,
    required: true,
    min: 0,
  },
  ProductCostPerUnit: {
    type: Number,
    required: true,
    min: 0,
  },
  SellingPriceinLL:{
    type: Number,
    required: true,
    min: 0
  },
  OneLitreSellingPriceinLL:{
    type: Number,
    required: true,
    min:0
  },
  Wholesale12BottlesPriceinLL:{
    type: Number,
    required: true,
    min:0
  }
});

// Define virtual field
productPricingSchema.virtual('TotalCost').get(function() {
  // Calculate TotalCost as BottleCost + ProductCostPerUnit
  return this.BottleCost + this.ProductCostPerUnit;
});

productPricingSchema.virtual('SellingPriceinUSD').get(function() {
    // Calculate SellingPriceinUSD as SellingPriceinLL/90000 (90000 is the exchange rate)
    return this.SellingPriceinLL/90000;
  });

productPricingSchema.virtual('UnitProfitinUSD').get(function() {
// Calculate UnitProfitinUSD as SellingPriceinUSD - TotalCost
return this.SellingPriceinUSD - this.TotalCost;
});

productPricingSchema.virtual('UnitProfitinLL').get(function() {
    // Calculate UnitProfitinLL as UnitProfitinUSD*90000 (90000 is the exchange rate)
    return this.UnitProfitinUSD*90000;
    });

productPricingSchema.virtual('OneLitreSellingPriceinUSD').get(function() {
    // Calculate OneLitreSellingPriceinUSD as OneLitreSellingPriceinLL/90000 (90000 is the exchange rate)
    return this.OneLitreSellingPriceinLL/90000;
    });

productPricingSchema.virtual('OneLitreProfitinUSD').get(function() {
    // Calculate OneLitreProfitinUSD as OneLitreSellingPriceinUSD -  (ProductCostPerUnit/3.75)
    return this.OneLitreSellingPriceinUSD - (this.ProductCostPerUnit/3.75);
    });

productPricingSchema.virtual('OneLitreProfitinLL').get(function() {
    // Calculate OneLitreProfitinLL as OneLitreProfitinUSD*90000 (90000 is the exchange rate)
    return this.OneLitreProfitinUSD*90000;
    });

productPricingSchema.virtual('WholesaleUnitProfitinUSD').get(function() {
    // Calculate WholesaleUnitProfitinUSD as Wholesale12BottlesPriceinLL/90000 - TotalCost  (90000 is the exchange rate)
    return this.Wholesale12BottlesPriceinLL/90000 - this.TotalCost;
    });

// Ensure virtual fields are serialized when sending JSON
productPricingSchema.set('toJSON', { virtuals: true });
productPricingSchema.set('toObject', { virtuals: true });

// Compile and export the model
module.exports = mongoose.model('ProductPricing', productPricingSchema);
