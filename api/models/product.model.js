import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

  productname:{
    type: String,
    required: true,
    unique: true,
  },
  productId:{
    type: String,
    required: true,
    unique: true,
  },
  botlesize: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  totalcost: {
    type: Number,
    required: true,
  },
  sellPriceUSD: {
    type: Number,
    required: true,
  },
  sellPriceLL: {
    type: Number,
    required: true,
  },
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

export default Product;
