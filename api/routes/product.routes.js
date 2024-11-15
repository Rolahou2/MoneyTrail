import express from "express";
import Product from "../models/product.model.js";
import { test } from "../controllers/product.controller.js";

const router =express.Router();

router.get("/test", test);

// Get all products
router.get("/", async(req,res) =>{
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Update an existing Product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
