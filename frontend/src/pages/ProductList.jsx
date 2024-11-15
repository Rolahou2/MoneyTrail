import React, { useState, useEffect } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]); // Array to store multiple new products

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Function to handle change for dynamic rows
  const handleNewProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedNewProducts = [...newProducts];
    updatedNewProducts[index] = { ...updatedNewProducts[index], [name]: value };
    setNewProducts(updatedNewProducts);
  };

  // Add a new empty row for adding a product
  const handleAddRow = () => {
    setNewProducts([
      ...newProducts,
      {
        productname: "",
        productId: "",
        botlesize: "",
        cost: "",
        totalcost: "",
        sellPriceLL: "",
      },
    ]);
  };

  // Delete a specific row from newProducts
  const handleDeleteRow = (index) => {
    const updatedNewProducts = newProducts.filter((_, i) => i !== index);
    setNewProducts(updatedNewProducts);
  };

  // Save all new products to the backend
  const handleSaveAllProducts = async () => {
    try {
      // Ensure all fields are filled
      const validProducts = newProducts.filter(
        (product) =>
          product.productname &&
          product.productId &&
          product.botlesize &&
          product.cost &&
          product.totalcost &&
          product.sellPriceLL
      );
  
      if (validProducts.length === 0) {
        console.error("No valid products to save.");
        return;
      }
  
      console.log("Saving valid products:", validProducts);
  
      const responses = await Promise.all(
        validProducts.map((product) =>
          fetch("http://localhost:5000/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          })
        )
      );
  
      const savedProducts = await Promise.all(
        responses.map((res) => res.json())
      );
      console.log("Saved products:", savedProducts);
  
      setProducts([...products, ...savedProducts]);
      setNewProducts([]); // Clear the new products after saving
    } catch (error) {
      console.error("Error saving products:", error);
    }
  };
  
  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      // Update the `products` state to remove the deleted product
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  

  return (
    <div>
      <ul className="flex mb-4 float-right gap-4 p-6">
        <button
          onClick={handleAddRow}
          className="text-orange-600 border bg-orange-100 rounded-lg p-2 h-10 w-24 font-semibold"
        >
          Add
        </button>
        <button
          onClick={handleSaveAllProducts}
          className="text-green-600 border bg-green-100 rounded-lg p-2 h-10 w-24 font-semibold"
        >
          Save
        </button>
      </ul>

      {/* Table to display products */}
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Product Name</th>
            <th className="border border-gray-300 p-2">Product ID</th>
            <th className="border border-gray-300 p-2">Bottle Size</th>
            <th className="border border-gray-300 p-2">Cost</th>
            <th className="border border-gray-300 p-2">Total Cost</th>
            <th className="border border-gray-300 p-2">Sell Price (LL)</th>
            <th className="border border-gray-300 p-2">Sell Price (USD)</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render existing products */}
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border border-gray-300 p-2">
                {product.productname}
              </td>
              <td className="border border-gray-300 p-2">
                {product.productId}
              </td>
              <td className="border border-gray-300 p-2">
                {product.botlesize}
              </td>
              <td className="border border-gray-300 p-2">${product.cost}</td>
              <td onChange={(e) => handleNewProductChange(index, e)} type="number" className="border border-gray-300 p-2">${product.totalcost}</td>
              <td className="border border-gray-300 p-2">
                {product.sellPriceLL}
              </td>
              <td type="number" className="border border-gray-300 p-2">${(product.sellPriceLL / 90000).toFixed(2)}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="text-red-600 border bg-red-100 rounded-lg p-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {/* Render rows for new products with delete option */}
          {newProducts.map((product, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  name="productname"
                  placeholder="Product Name"
                  value={product.productname}
                  onChange={(e) => handleNewProductChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  name="productId"
                  placeholder="Product ID"
                  value={product.productId}
                  onChange={(e) => handleNewProductChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  name="botlesize"
                  placeholder="Bottle Size"
                  value={product.botlesize}
                  onChange={(e) => handleNewProductChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <div className="relative">
                  <span>$</span>
                  <input
                    type="number"
                    name="cost"
                    placeholder="Cost"
                    value={product.cost}
                    onChange={(e) => handleNewProductChange(index, e)}
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    $
                  </span>
                  <input
                    type="number"
                    name="totalcost"
                    placeholder="Total Cost"
                    value={product.totalcost}
                    onChange={(e) => handleNewProductChange(index, e)}
                    className="pl-4 w-full" // Add padding-left to make room for the $
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  name="sellPriceLL"
                  placeholder="Sell Price (LL)"
                  value={product.sellPriceLL}
                  onChange={(e) => handleNewProductChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <div className="relative">
                  <span>$</span>
                  <input
                    type="number"
                    value={(product.sellPriceLL / 90000).toFixed(2)}
                    readOnly
                  />
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleDeleteRow(index)}
                  className="text-red-600 border bg-red-100 rounded-lg p-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;