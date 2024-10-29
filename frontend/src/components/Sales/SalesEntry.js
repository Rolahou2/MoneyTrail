import React, { useState, useEffect } from 'react';
import { postSale, getProducts } from '../../api/api'; // Import API functions to send data and fetch products

const SalesEntry = () => {
  const [sale, setSale] = useState({
    date: '',
    type: '',
    product: '',
    SoldInBottle: '',
    quantity: '',
    unitPriceInLL: '',
    profitPerUnitInLL: ''
  });
  const [products, setProducts] = useState([]); // Store list of products

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(); // API call to fetch products
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Update sale data when user inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale({ ...sale, [name]: value });
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!sale.product) {
      alert("Please select a product.");
      return;
    }

    try {
      await postSale(sale); // API function to submit sale data
      alert("Sale added successfully!");
      setSale({
        date: '',
        type: '',
        product: '',
        SoldInBottle: '',
        quantity: '',
        unitPriceInLL: '',
        profitPerUnitInLL: ''
      });
    } catch (error) {
      console.error("Failed to add sale:", error);
      alert("Failed to add sale.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sales Entry</h3>

      <label>Date:</label>
      <input
        type="date"
        name="date"
        value={sale.date}
        onChange={handleChange}
        required
      />

      <label>Type:</label>
      <select name="type" value={sale.type} onChange={handleChange} required>
        <option value="">Select Type</option>
        <option value="B2B">B2B</option>
        <option value="B2C">B2C</option>
      </select>

      <label>Product:</label>
      <select name="product" value={sale.product} onChange={handleChange} required>
        <option value="">Select Product</option>
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name} - {product.price} LL
          </option>
        ))}
      </select>

      <label>Sold In Bottle:</label>
      <select name="SoldInBottle" value={sale.SoldInBottle} onChange={handleChange} required>
        <option value="">Select Option</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <label>Quantity:</label>
      <input
        type="number"
        name="quantity"
        value={sale.quantity}
        onChange={handleChange}
        min="1"
        required
      />

      <button type="submit">Add Sale</button>
    </form>
  );
};

export default SalesEntry;
