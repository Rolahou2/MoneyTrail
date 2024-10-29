const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category:{
    type: String,
    required: true,
    enum:['Regular Facility Expenses', 'Purchases & Supplies', 'Travel & Transportation', 'Irregular Facility Expenses', 'Course & Consultation Fees'],
  },
  description:{
    type: String,
    required: true,
    trim:true,
  },
  weightinGrams:{
    type: Number,
    required: false,
    min:0,
  },
  date:{
    type: Date,
    default: Date.now,
  },
  paymentinLL:{
    type: Number,
    required: true,
    min: 0,
    validate: {
        validator: function() {
            return this.paymentinLL != null || this.paymentinUSD != null;
        },
        message: "Either 'paymentinLL' or 'paymentinUSD' is required"
    }
  },
  paymentinUSD:{
    type: Number,
    required: true,
    min: 0,
    validate: {
        validator: function() {
            return this.paymentinLL != null || this.paymentinUSD != null;
        },
        message: "Either 'paymentinLL' or 'paymentinUSD' is required"
    }
  },
  ExchangeRate:{
    type: Number,
    required: true,
    min: 0,
  }
});

// Define virtual field for UnitPriceinUSD
expenseSchema.virtual('UnitPriceinUSD').get(function() {
    // Check if paymentInUSD and weightInGrams are both available
    if (this.paymentinUSD && this.weightinGrams) {
      return this.paymentinUSD / this.weightinGrams;
    }
    return null; // Return null if either value is missing
  });

// Define virtual field for UnitPriceinLL
expenseSchema.virtual('UnitPriceinLL').get(function() {
    // Check if paymentinLL and weightInGrams are both available
    if (this.paymentinLL && this.weightinGrams) {
      return this.paymentinLL / this.weightinGrams;
    }
    return null; // Return null if either value is missing
  });

// Define virtual field for PricePerKiloInUSD
expenseSchema.virtual('PricePerKiloInUSD').get(function() {
    const unitPrice = this.UnitPriceinUSD;
    if (unitPrice !== null) {
      return unitPrice * 1000; // Convert from per gram to per kilogram
    }
    return null; // Return null if unitPriceInUSD is not available
  });

// Ensure virtual fields are serialized when sending JSON
expenseSchema.set('toJSON', { virtuals: true });
expenseSchema.set('toObject', { virtuals: true }); 

module.exports = mongoose.model('Expense', expenseSchema);
