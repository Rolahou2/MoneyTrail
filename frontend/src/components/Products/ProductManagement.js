import React, { useState } from 'react';
import { postProduct } from '../../api/api'; // Import the API function to send data to the backend

const ProductManagement = () => {
  const [product, setProduct] = useState({
    ProductName: '',
    ProductID: '',
    BottleSizeInLitre: '',
    BottleCost: '',
    ProductCostPerUnit: '',
    SellingPriceinLL: '',
    OneLitreSellingPriceinLL: '',
    Wholesale12BottlesPriceinLL: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await postProduct(product); // Call the API function to submit data to the backend
      alert("Product added successfully!");
      setProduct({
        ProductName: '',
        ProductID: '',
        BottleSizeInLitre: '',
        BottleCost: '',
        ProductCostPerUnit: '',
        SellingPriceinLL: '',
        OneLitreSellingPriceinLL: '',
        Wholesale12BottlesPriceinLL: ''
      });
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Product Management</h3>

      <label>Product Name:</label>
      <input
        type="text"
        name="ProductName"
        value={product.ProductName}
        onChange={handleChange}
        required
      />

      <label>Product ID:</label>
      <input
        type="text"
        name="ProductID"
        value={product.ProductID}
        onChange={handleChange}
        required
      />

      <label>Bottle Size in Litres:</label>
      <input
        type="number"
        name="BottleSizeInLitre"
        value={product.BottleSizeInLitre}
        onChange={handleChange}
        min="1"
        required
      />

      <label>Bottle Cost:</label>
      <input
        type="number"
        name="BottleCost"
        value={product.BottleCost}
        onChange={handleChange}
        min="0"
        required
      />

      <label>Product Cost Per Unit:</label>
      <input
        type="number"
        name="ProductCostPerUnit"
        value={product.ProductCostPerUnit}
        onChange={handleChange}
        min="0"
        required
      />

      <label>Selling Price in LL:</label>
      <input
        type="number"
        name="SellingPriceinLL"
        value={product.SellingPriceinLL}
        onChange={handleChange}
        min="0"
        required
      />

      <label>One Litre Selling Price in LL:</label>
      <input
        type="number"
        name="OneLitreSellingPriceinLL"
        value={product.OneLitreSellingPriceinLL}
        onChange={handleChange}
        min="0"
        required
      />

      <label>Wholesale 12 Bottles Price in LL:</label>
      <input
        type="number"
        name="Wholesale12BottlesPriceinLL"
        value={product.Wholesale12BottlesPriceinLL}
        onChange={handleChange}
        min="0"
        required
      />

      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductManagement;
