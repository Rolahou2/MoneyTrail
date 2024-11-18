import { text } from "express";
import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
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
    },
    cost: {
      type: String,
      required: true,
    },
    totalcost: {
      type: String,
      required: true,
    },
    sellPriceUSDwithBottle: {
      type: String,
      required: false,
    },
    sellPriceLLwithBottle: {
      type: Number,
      required: true,
    },
    sellPriceUSDwithoutBottle: {
      type: String,
      required: false,
    },
    sellPriceLLwithoutBottle: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
