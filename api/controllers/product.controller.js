import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";

export const createProduct = async (req, res, next) => {
    try {
        const newProduct = await Product.create(req.body);
        return res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) return  next(errorHandler(404, "Product not found"));

    try {
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json("Product has been deleted!");
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) return  next(errorHandler(404, "Product not found"));

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message }); 
    }
};
