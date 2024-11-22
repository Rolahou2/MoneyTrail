import React, { useState, useEffect } from "react";
import {
  FaImage,
  FaList,
  FaTint,
  FaPaintBrush,
  FaPlus,
  FaSave,
  FaEdit,
  FaTrashAlt,
  FaUndo,
} from "react-icons/fa"; // Icons for buttons

const ProductList = () => {
  const [newProduct, setNewProduct] = useState({
    productId: "",
    category: "",
    scent: "",
    color: "",
    productname: "",
    botlesize: "",
    cost: "",
    totalcost: "",
    sellPriceLLwithBottle: "",
    sellPriceUSDwithBottle: "",
    sellPriceLLwithoutBottle: "",
    sellPriceUSDwithoutBottle: "",
  });

  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]); // Array to store multiple new products
  const [successMessage, setSuccessMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showValidationError, setShowValidationError] = useState(false);
  // State to track selected category
  const [selectedCategory, setSelectedCategory] = useState("");

  const [uploadedImages, setUploadedImages] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(""); // Track which dropdown is active
  const [selectedOptions, setSelectedOptions] = useState({
    category: "",
    scent: "",
    color: "",
  });

  const categories = [
    "Handwash",
    "Laundry Detergent",
    "Floor Cleaner",
    "Dish Soap",
    "Odex Cleaner",
    "Flash Cleaner",
  ];
  const scents = ["Amarij", "Apple", "Lavender", "Bubble", "test"];
  const colors = ["Red", "Green", "Violet", "Pink", "blue", "colorless"];
  // Section 1 left part
  const handleIconClick = (type) => {
    setActiveDropdown((prev) => (prev === type ? "" : type)); // Toggle the dropdown
  };
  const handleOptionSelect = (type, option) => {
    setSelectedOptions((prev) => ({ ...prev, [type]: option })); // Save selected option
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [type]: option,
    }));
    setActiveDropdown(""); // Close the dropdown
  };
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const isValidProduct = (product) => {
    return (
      product.productId &&
      product.category &&
      product.scent &&
      product.color &&
      product.botlesize &&
      product.cost &&
      product.totalcost &&
      product.sellPriceLLwithBottle &&
      product.sellPriceLLwithoutBottle
    );
  };
  const confirmDelete = (idOrIndex, isNewProduct) => {
    console.log(
      `Confirm delete: ID or Index: ${idOrIndex}, isNew: ${isNewProduct}`
    );
    setDeleteTarget({ idOrIndex, isNewProduct });
  };
  // Function to handle change for dynamic rows
  const handleProductChange = (fieldName, value) => {
    console.log(`Updating ${fieldName} with value: ${value}`);
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [fieldName]: value,
    }));
  };
  // Add a new empty row for adding a product
  const handleAddProduct = () => {
    const {
      category,
      scent,
      color,
      sellPriceLLwithBottle,
      sellPriceLLwithoutBottle,
    } = newProduct;

    const generatedProduct = {
      ...newProduct,
      productname: `${category || ""}_${scent || ""}_${color || ""}`.trim(),
      sellPriceUSDwithBottle: sellPriceLLwithBottle
        ? (sellPriceLLwithBottle / 90000).toFixed(2)
        : "",
      sellPriceUSDwithoutBottle: sellPriceLLwithoutBottle
        ? (sellPriceLLwithoutBottle / 90000).toFixed(2)
        : "",
      isNew: true,
    };

    if (!isValidProduct(generatedProduct)) {
      console.log(generatedProduct);
      console.error("Validation failed. Please fill all required fields.");
      setShowValidationError(true);
      return;
    }
    const productWithEditing = { ...generatedProduct, isEditing: false };
    setNewProducts((prev) => [productWithEditing, ...prev]);
    setNewProduct({
      productId: "",
      category: "",
      scent: "",
      color: "",
      productname: "",
      botlesize: "",
      cost: "",
      totalcost: "",
      sellPriceLLwithBottle: "",
      sellPriceUSDwithBottle: "",
      sellPriceLLwithoutBottle: "",
      sellPriceUSDwithoutBottle: "",
    });

    setSelectedOptions({
      category: "",
      scent: "",
      color: "",
    });

    setShowValidationError(false);
    console.log("Product added successfully:", productWithEditing);
  };
  // Save all new products to the backend
  const handleSaveProduct = async () => {
    try {
      const validNewProducts = newProducts.filter((product) =>
        isValidProduct(product)
      );

      if (validNewProducts.length === 0) {
        console.error("No valid products to save.");
        return;
      }

      const responses = await Promise.all(
        validNewProducts.map((product) =>
          fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          })
        )
      );

      const failedResponses = responses.filter((res) => !res.ok);
      if (failedResponses.length > 0) {
        throw new Error("Some products failed to save");
      }

      const savedProducts = await Promise.all(
        responses.map((res) => res.json())
      );
      setProducts((prev) => [...savedProducts, ...prev]);
      setNewProducts([]); // Clear form
      setSuccessMessage("Products saved successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
      setIsExpanded(false);
    } catch (error) {
      console.error("Error saving products:", error);
    }
  };
  // Handle image upload
  const handleImageUpload = (event, productIndex) => {
    const file = event.target.files[0];
    if (file) {
      const updatedImages = {
        ...uploadedImages,
        [productIndex]: URL.createObjectURL(file),
      };
      setUploadedImages(updatedImages);
    }
  };

  const handleResetSelection = () => {
    setSelectedOptions({
      category: "",
      scent: "",
      color: "",
    });
    setActiveDropdown(""); // Close any active dropdown
  };

  const handleEditClick = (product, index, isNew) => {
    setIsExpanded(true);
    if (isNew) {
      const updatedNewProducts = newProducts.map((s, i) =>
        i === index ? { ...s, isEditing: true } : s
      );
      setNewProducts(updatedNewProducts);
    } else {
      const updatedProducts = products.map((s) =>
        s._id === product._id ? { ...s, isEditing: true } : s
      );
      setProducts(updatedProducts);
    }
  };

  const handleEditChange = (index, field, value, isNew) => {
    const updateProduct = (product, isNew) => {
      // Update the changed field
      const updatedProduct = { ...product, [field]: value };

      // Recalculate `productname` if category, scent, or color changes
      if (["category", "scent", "color"].includes(field)) {
        updatedProduct.productname = `${updatedProduct.category || ""}_${
          updatedProduct.scent || ""
        }_${updatedProduct.color || ""}`.trim();
      }

      // Recalculate `sellPriceUSDwithBottle` and `sellPriceUSDwithoutBottle` if relevant fields change
      if (
        ["sellPriceLLwithBottle", "sellPriceLLwithoutBottle"].includes(field)
      ) {
        if (field === "sellPriceLLwithBottle") {
          updatedProduct.sellPriceUSDwithBottle = (value / 90000).toFixed(2);
        }
        if (field === "sellPriceLLwithoutBottle") {
          updatedProduct.sellPriceUSDwithoutBottle = (value / 90000).toFixed(2);
        }
      }

      return updatedProduct;
    };

    if (isNew) {
      // Handle edits for new products
      const updatedNewProducts = [...newProducts];
      updatedNewProducts[index] = updateProduct(
        updatedNewProducts[index],
        true
      );
      setNewProducts(updatedNewProducts);
    } else {
      // Handle edits for existing products
      const updatedProducts = [...products];
      updatedProducts[index] = updateProduct(updatedProducts[index], false);
      setProducts(updatedProducts);
    }
  };

  const saveEdit = async (product, index, isNew) => {
    try {
      if (isNew) {
        const updatedNewProducts = [...newProducts];
        updatedNewProducts[index].isEditing = false;
        setNewProducts(updatedNewProducts);
      } else {
        const response = await fetch(`/api/products/${product._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });

        if (!response.ok) throw new Error("Failed to save product changes");
        const updatedProducts = products.map((s) =>
          s._id === product._id ? { ...product, isEditing: false } : s
        );
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error saving product changes:", error);
    }
  };

  const cancelEdit = (index, isNew) => {
    if (isNew) {
      const updatedNewProducts = [...newProducts];
      updatedNewProducts[index].isEditing = false;
      setNewProducts(updatedNewProducts);
    } else {
      const updatedProducts = [...products];
      updatedProducts[index - newProducts.length].isEditing = false;
      setProducts(updatedProducts);
    }
  };

  const handleDeleteProduct = async (idOrIndex, isNewProduct = false) => {
    if (isNewProduct) {
      // Handle deletion of a new product (client-side only)
      const updatedNewProducts = newProducts.filter((_, i) => i !== idOrIndex);
      setNewProducts(updatedNewProducts);
    } else {
      try {
        const response = await fetch(`/api/products/${idOrIndex}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product from the database");
        }

        // Remove the product from the UI state
        const updatedProducts = products.filter(
          (product) => product._id !== idOrIndex
        );
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setDeleteTarget(null); // Close the modal after deletion
  };

  // Filter products based on selected category
  console.log("Selected Category:", selectedCategory);

  const filteredProducts =
    selectedCategory && selectedCategory.trim() !== ""
      ? products.filter((product) => product.category === selectedCategory)
      : [];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      {/* Section 1 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f0f8ff",
          padding: "20px",
          marginBottom: "5px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Section 1: Row with Two Parts */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          {/* Part 1: Category, Scent, and Color */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#e6f7ff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
                textAlign: "center",
                fontSize: "36px",
              }}
            >
              Manage Products
            </h2>

            <div
              style={{
                display: "flex",
                gap: "30px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Category Icon */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => handleIconClick("category")}
                  disabled={!!selectedOptions.category}
                  style={{
                    textDecoration: "none",
                    color: selectedOptions.category ? "#ccc" : "#000", // Change color if disabled
                    fontSize: "24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    cursor: selectedOptions.category
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  <FaList style={{ fontSize: "40px" }} />
                  <span style={{ fontSize: "14px", marginTop: "10px" }}>
                    Category
                  </span>
                </button>
                {activeDropdown === "category" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "60px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      padding: "10px",
                      zIndex: 1,
                    }}
                  >
                    {categories.map((category) => (
                      <div
                        key={category}
                        onClick={() => handleOptionSelect("category", category)}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          color: "#333",
                          fontSize: "14px",
                        }}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scent Icon */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => handleIconClick("scent")}
                  disabled={!!selectedOptions.scent}
                  style={{
                    textDecoration: "none",
                    color: selectedOptions.scent ? "#ccc" : "#000",
                    fontSize: "24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    cursor: selectedOptions.scent ? "not-allowed" : "pointer",
                  }}
                >
                  <FaTint style={{ fontSize: "40px" }} />
                  <span style={{ fontSize: "14px", marginTop: "10px" }}>
                    Scent
                  </span>
                </button>
                {activeDropdown === "scent" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "60px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      padding: "10px",
                      zIndex: 1,
                    }}
                  >
                    {scents.map((scent) => (
                      <div
                        key={scent}
                        onClick={() => handleOptionSelect("scent", scent)}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          color: "#333",
                          fontSize: "14px",
                        }}
                      >
                        {scent}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Icon */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => handleIconClick("color")}
                  disabled={!!selectedOptions.color}
                  style={{
                    textDecoration: "none",
                    color: selectedOptions.color ? "#ccc" : "#000",
                    fontSize: "24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    cursor: selectedOptions.color ? "not-allowed" : "pointer",
                  }}
                >
                  <FaPaintBrush style={{ fontSize: "40px" }} />
                  <span style={{ fontSize: "14px", marginTop: "10px" }}>
                    Color
                  </span>
                </button>
                {activeDropdown === "color" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "60px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      padding: "10px",
                      zIndex: 1,
                    }}
                  >
                    {colors.map((color) => (
                      <div
                        key={color}
                        onClick={() => handleOptionSelect("color", color)}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          color: "#333",
                          fontSize: "14px",
                        }}
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reset Icon */}

            <button
              onClick={handleResetSelection}
              disabled={
                !selectedOptions.category &&
                !selectedOptions.scent &&
                !selectedOptions.color
              } // Disable when no selection
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                background: "none",
                color:
                  selectedOptions.category ||
                  selectedOptions.scent ||
                  selectedOptions.color
                    ? "#008CBA" // Enabled color
                    : "#ccc", // Disabled color,
                border: "none",
                cursor:
                  selectedOptions.category ||
                  selectedOptions.scent ||
                  selectedOptions.color
                    ? "pointer"
                    : "not-allowed", // Disable cursor
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaUndo style={{ fontSize: "30px" }} />
            </button>

            {/* Display Selected Options */}
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#FF4500",
              }}
            >
              {selectedOptions.category && (
                <p>Category: {selectedOptions.category}</p>
              )}
              {selectedOptions.scent && <p>Scent: {selectedOptions.scent}</p>}
              {selectedOptions.color && <p>Color: {selectedOptions.color}</p>}
            </div>
          </div>

          {/* Part 2: New Product Entry */}
          <div
            style={{
              flex: 2,
              backgroundColor: "#e6f7ff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ marginBottom: "10px", textAlign: "center" }}>
              New Product Entry
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  width: "450px",
                  gap: "10px",
                }}
              >
                <label
                  htmlFor="productId"
                  style={{ fontWeight: "bold", color: "#888", margin: "0" }}
                >
                  Product ID:
                </label>
                <input
                  id="productId"
                  type="text"
                  placeholder="Enter Value"
                  style={{
                    outline: "none",
                    border: "none",
                    flex: 1,
                    color: "#008CBA",
                    fontWeight: "bold",
                  }}
                  value={newProduct.productId}
                  onChange={(e) =>
                    handleProductChange("productId", e.target.value)
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  width: "450px",
                  gap: "10px",
                }}
              >
                <label
                  htmlFor="botlesize"
                  style={{ fontWeight: "bold", color: "#888", margin: "0" }}
                >
                  Bottle Size:
                </label>
                <input
                  id="botlesize"
                  type="number"
                  placeholder="Enter Value"
                  style={{
                    outline: "none",
                    border: "none",
                    flex: 1,
                    color: "#008CBA",
                    fontWeight: "bold",
                  }}
                  value={newProduct.botlesize}
                  min={0}
                  onChange={(e) =>
                    handleProductChange("botlesize", e.target.value)
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  width: "450px",
                  gap: "10px",
                }}
              >
                <label
                  htmlFor="cost"
                  style={{ fontWeight: "bold", color: "#888", margin: "0" }}
                >
                  Cost ($):
                </label>
                <input
                  id="cost"
                  type="number"
                  placeholder="Enter Value"
                  style={{
                    outline: "none",
                    border: "none",
                    flex: 1,
                    color: "#008CBA",
                    fontWeight: "bold",
                  }}
                  value={newProduct.cost}
                  min={0}
                  onChange={(e) => handleProductChange("cost", e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  width: "450px",
                  gap: "10px",
                }}
              >
                <label
                  htmlFor="totalcost"
                  style={{ fontWeight: "bold", color: "#888", margin: "0" }}
                >
                  Total Cost ($):
                </label>
                <input
                  id="totalcost"
                  type="number"
                  placeholder="Enter Value"
                  style={{
                    outline: "none",
                    border: "none",
                    flex: 1,
                    color: "#008CBA",
                    fontWeight: "bold",
                  }}
                  value={newProduct.totalcost}
                  min={0}
                  onChange={(e) =>
                    handleProductChange("totalcost", e.target.value)
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  width: "450px",
                  gap: "10px",
                }}
              >
                <label
                  htmlFor="sellPriceLLwithBottle"
                  style={{ fontWeight: "bold", color: "#888", margin: "0" }}
                >
                  Price with Bottle (LL):
                </label>
                <input
                  id="sellPriceLLwithBottle"
                  type="number"
                  placeholder="Enter Value"
                  style={{
                    outline: "none",
                    border: "none",
                    flex: 1,
                    color: "#008CBA",
                    fontWeight: "bold",
                  }}
                  value={newProduct.sellPriceLLwithBottle}
                  min={0}
                  onChange={(e) =>
                    handleProductChange("sellPriceLLwithBottle", e.target.value)
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  width: "450px",
                  gap: "10px",
                }}
              >
                <label
                  htmlFor="sellPriceLLwithoutBottle"
                  style={{ fontWeight: "bold", color: "#888", margin: "0" }}
                >
                  Price without Bottle (LL):
                </label>
                <input
                  id="sellPriceLLwithoutBottle"
                  type="number"
                  placeholder="Enter Value"
                  style={{
                    outline: "none",
                    border: "none",
                    flex: 1,
                    color: "#008CBA",
                    fontWeight: "bold",
                  }}
                  value={newProduct.sellPriceLLwithoutBottle}
                  min={0}
                  onChange={(e) =>
                    handleProductChange(
                      "sellPriceLLwithoutBottle",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
                justifyContent: "center",
              }}
            >
              {showValidationError && (
                <div className="error-message">
                  Please fill in all required fields before adding the product.
                </div>
              )}
              <button
                style={{
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onClick={handleAddProduct}
              >
                <FaPlus />
                Add
              </button>
              <button
                style={{
                  backgroundColor: "#008CBA",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onClick={handleSaveProduct}
              >
                <FaSave />
                Save
              </button>
            </div>
            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-2 bg-green-200 text-green-700 rounded-lg text-center">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div
        style={{
          backgroundColor: "#e6f7ff",
          padding: "5px",
          marginBottom: "5px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          cursor: "pointer", // Show pointer cursor to indicate clickability
          display: "flex", // Center content
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          style={{
            cursor: "pointer",
            padding: "10px",
            backgroundColor: "#e6f7ff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", fontSize: "24px", margin: "0" }}>
            Products Overview
          </h2>
        </div>

        {isExpanded && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            {/* Loading and Error States */}
            {loading && <p>Loading products...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
              <table>
                <thead>
                  <tr className="border border-gray-300">
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Product ID
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Category
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Scent
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Color
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Product Name
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Bottle Size
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Cost ($)
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Total Cost ($)
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Price with Bottle (LL)
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Price with Bottle ($)
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Price without Bottle (LL)
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Price without Bottle ($)
                    </th>
                    <th
                      className="border border-gray-300 p-2 text-center align-middle"
                      style={{ color: "#2C3E50" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...newProducts.map((product, index) => ({
                      ...product,
                      index,
                      isNew: true,
                    })),
                    ...products.map((product, index) => ({
                      ...product,
                      index,
                      isNew: false,
                    })),
                  ].map((product) => (
                    <tr
                      key={product._id || `new-${product.index}`}
                      className="border border-gray-300"
                      style={{
                        backgroundColor: product.isEditing
                          ? "#d4e6f1" // Highlight blue when editing
                          : product.isNew
                          ? "#fffacd" // Highlight yellow for new products
                          : "transparent",
                      }}
                    >
                      {product.isEditing ? (
                        <>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <input
                              type="text"
                              value={product.productId}
                              readOnly
                              className="edit-input"
                            />
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <select
                              type="text"
                              value={product.category}
                              onChange={(e) =>
                                handleEditChange(
                                  product.index,
                                  "category",
                                  e.target.value,
                                  product.isNew
                                )
                              }
                              className="edit-input"
                            >
                              <option value="" disabled>
                                Select a Category
                              </option>
                              {categories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <select
                              type="text"
                              value={product.scent}
                              onChange={(e) =>
                                handleEditChange(
                                  product.index,
                                  "scent",
                                  e.target.value,
                                  product.isNew
                                )
                              }
                              className="edit-input"
                            >
                              <option value="" disabled>
                                Select a Scent
                              </option>
                              {scents.map((scent) => (
                                <option key={scent} value={scent}>
                                  {scent}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <select
                              type="text"
                              value={product.color}
                              onChange={(e) =>
                                handleEditChange(
                                  product.index,
                                  "color",
                                  e.target.value,
                                  product.isNew
                                )
                              }
                              className="edit-input"
                            >
                              <option value="" disabled>
                                Select a Color
                              </option>
                              {colors.map((color) => (
                                <option key={color} value={color}>
                                  {color}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <input
                              type="text"
                              value={product.productname}
                              readOnly
                              className="edit-input"
                            />
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <input
                              type="number"
                              value={product.botlesize}
                              onChange={(e) =>
                                handleEditChange(
                                  product.index,
                                  "botlesize",
                                  e.target.value,
                                  product.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <input
                              type="text"
                              value={product.cost}
                              onChange={(e) =>
                                handleEditChange(
                                  product.index,
                                  "cost",
                                  e.target.value,
                                  product.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>

                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <input
                              type="number"
                              value={product.totalcost}
                              onChange={(e) =>
                                handleEditChange(
                                  product.index,
                                  "totalcost",
                                  e.target.value,
                                  product.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <input
                              type="number"
                              value={product.sellPriceLLwithBottle}
                              onChange={(e) =>
                                handleEditChange(
                                  product.index,
                                  "sellPriceLLwithBottle",
                                  e.target.value,
                                  product.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <input
                              type="number"
                              value={product.sellPriceUSDwithBottle}
                              onChange={(e) =>
                                handleEditChange(
                                  product.index,
                                  "sellPriceUSDwithBottle",
                                  e.target.value,
                                  product.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <input
                              type="number"
                              value={product.sellPriceLLwithoutBottle}
                              onChange={(e) =>
                                handleEditChange(
                                  product.index,
                                  "sellPriceLLwithoutBottle",
                                  e.target.value,
                                  product.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <input
                              type="number"
                              value={product.sellPriceUSDwithoutBottle}
                              onChange={(e) =>
                                handleEditChange(
                                  product.index,
                                  "sellPriceUSDwithoutBottle",
                                  e.target.value,
                                  product.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "5px",
                              }}
                            >
                              <button
                                onClick={() =>
                                  saveEdit(
                                    product,
                                    product.index,
                                    product.isNew
                                  )
                                }
                                className="savetb-button"
                              >
                                Save
                              </button>
                              <button
                                onClick={() =>
                                  cancelEdit(product.index, product.isNew)
                                }
                                className="cancel-button"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.productId}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.category}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.scent}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.color}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.productname}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.botlesize}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.cost}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.totalcost}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.sellPriceLLwithBottle}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.sellPriceUSDwithBottle}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.sellPriceLLwithoutBottle}
                          </td>
                          <td
                            className="border border-gray-300 p-2 text-center align-middle"
                            style={{ color: "#444" }}
                          >
                            {product.sellPriceUSDwithoutBottle}
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <div className="actions-buttons">
                              <button
                                className="edit-button"
                                onClick={() =>
                                  handleEditClick(
                                    product,
                                    product.index,
                                    product.isNew
                                  )
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="delete-button"
                                onClick={() =>
                                  confirmDelete(
                                    product.isNew ? product.index : product._id,
                                    product.isNew
                                  )
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {deleteTarget && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white text-black rounded-lg p-4 shadow-lg">
                  <p className="mb-4">
                    Are you sure you want to delete this sale?
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        handleDeleteProduct(
                          deleteTarget.idOrIndex,
                          deleteTarget.isNewSale
                        )
                      }
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteTarget(null)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 3 */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          backgroundColor: "#d9f7be",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left: Category Buttons */}
        <div
          style={{
            flex: 0.5,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "flex-start",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "10px 15px",
                backgroundColor:
                  selectedCategory === category ? "#4CAF50" : "#008CBA",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                textAlign: "center",
                width: "100%",
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Right: Product Columns */}
        <div
          style={{
            flex: 3,
            display: "flex",
            gap: "10px",
            overflowX: "auto",
          }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: product.isEditing ? "#f0f8ff" : "#f7f7f7",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  width: "250px", // Fixed width for each product column
                  height: "310px",
                  textAlign: "center",
                  display: "flex", // Flexbox for vertical alignment
                  flexDirection: "column", // Arrange content in a column
                  justifyContent: "space-between", // Ensure content spacing
                  overflow: "hidden", // Hide overflowing content
                }}
              >
                {/* Image Upload */}
                <div style={{ marginBottom: "10px", position: "relative" }}>
                  {uploadedImages[index] ? (
                    <img
                      src={uploadedImages[index]}
                      alt="Uploaded"
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <label
                      htmlFor={`upload-${index}`}
                      style={{
                        display: "inline-block",
                        padding: "20px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "50%",
                        cursor: "pointer",
                        color: "#888",
                      }}
                    >
                      <FaImage style={{ fontSize: "20px" }} />
                    </label>
                  )}
                  <input
                    id={`upload-${index}`}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, index)}
                  />
                </div>

                {/* Product Name */}
                <h4
                  style={{
                    marginBottom: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "12px",
                    color: "#333",
                    padding: "5px",
                  }}
                >
                  {product.productname}
                </h4>
                {/* Product Details */}
                <div
                  style={{
                    textAlign: "left",
                    fontSize: "10px",
                    color: "#555",
                    overflowY: "auto",
                    maxHeight: "150px",
                  }}
                >
                  <p>
                    <strong>Product ID:</strong> {product.productId}
                  </p>
                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p>
                    <strong>Scent:</strong> {product.scent}
                  </p>
                  <p>
                    <strong>Color:</strong> {product.color}
                  </p>
                  <p>
                    <strong>Bottle Size:</strong> {product.botlesize} ml
                  </p>
                  <p>
                    <strong>Cost:</strong> ${product.cost}
                  </p>
                  <p>
                    <strong>Total Cost:</strong> ${product.totalcost}
                  </p>
                  <p>
                    <strong>Price with Bottle (LL):</strong>{" "}
                    {product.sellPriceLLwithBottle}
                  </p>
                  <p>
                    <strong>Price with Bottle ($):</strong>{" "}
                    {product.sellPriceUSDwithBottle}
                  </p>
                  <p>
                    <strong>Price without Bottle (LL):</strong>{" "}
                    {product.sellPriceLLwithoutBottle}
                  </p>
                  <p>
                    <strong>Price without Bottle ($):</strong>{" "}
                    {product.sellPriceUSDwithoutBottle}
                  </p>
                </div>

                {/* Edit and Delete Icons */}
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => handleEditClick(product, index, false)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#4CAF50",
                    }}
                  >
                    <FaEdit style={{ fontSize: "16px" }} />
                  </button>
                  <button
                    onClick={() => confirmDelete(product._id, false)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#FF0000",
                    }}
                  >
                    <FaTrashAlt style={{ fontSize: "16px" }} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                margin: "auto",
                color: "#555",
                fontSize: "20px",
              }}
            >
              Select a category to view products.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
