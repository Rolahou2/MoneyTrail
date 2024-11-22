import { text } from "express";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    scent: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
      default: "colorless",
    },
    productname: {
      type: String,
      required: true,
      unique: true,
    },
    botlesize: {
      type: Number,
      required: true,
      min: 0,
    },
    cost: {
      type: String,
      required: true,
      min: 0,
    },
    totalcost: {
      type: String,
      required: true,
      min: 0,
    },
    sellPriceUSDwithBottle: {
      type: String,
      required: false,
      min: 0,
    },
    sellPriceLLwithBottle: {
      type: Number,
      required: true,
      min: 0,
    },
    sellPriceUSDwithoutBottle: {
      type: String,
      required: false,
      min: 0,
    },
    sellPriceLLwithoutBottle: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
