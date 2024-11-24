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
  FaTimes,
  FaBan,
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
  const [loading, setLoading] = useState();
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

  {
    /*const filteredProducts =
    selectedCategory && selectedCategory.trim() !== ""
      ? products.filter((product) => product.category === selectedCategory)
      : []; */
  }

  const [selectedScent, setSelectedScent] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Combine products and new products
  const combinedProducts = [
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
  ];

  // Filter products
  const filteredProducts = combinedProducts.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const matchesScent = selectedScent ? product.scent === selectedScent : true;
    const matchesColor = selectedColor ? product.color === selectedColor : true;
    const matchesName = searchName
      ? product.productname.toLowerCase().includes(searchName.toLowerCase())
      : true;

    return matchesCategory && matchesScent && matchesColor && matchesName;
  });

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Pagination controls
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleResetFilters = () => {
    setSearchCategory("");
    setSearchScent("");
    setSearchColor("");
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Section 1 */}
      <div>
        <div>
          <h1 style={{ textAlign: "center", fontSize: "24px", margin: "20px" }}>
            Products Overview
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-4 justify-start items-center">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-slate-400 px-3 py-2 border rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Scent Filter */}
          <select
            value={selectedScent}
            onChange={(e) => setSelectedScent(e.target.value)}
            className="text-slate-400 px-3 py-2 border rounded-md"
          >
            <option value="">All Scents</option>
            {scents.map((scent, index) => (
              <option key={index} value={scent}>
                {scent}
              </option>
            ))}
          </select>

          {/* Color Filter */}
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="text-slate-400 px-3 py-2 border rounded-md"
          >
            <option value="">All Colors</option>
            {colors.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>

          {/* Search Filter */}
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />

          {/* Reset Button */}
          <button
            onClick={() => {
              setSelectedCategory("");
              setSelectedScent("");
              setSelectedColor("");
              setSearchName("");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Reset Filters
          </button>
        </div>

        {/* Table Section */}
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
          <table className="w-full border-collapse border border-gray-300">
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
              {paginatedProducts.map((product) => (
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
                          className="actions-buttons"
                        >
                          <button
                            onClick={() =>
                              saveEdit(product, product.index, product.isNew)
                            }
                            className="savetb-button"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={() =>
                              cancelEdit(product.index, product.isNew)
                            }
                            className="cancel-button"
                          >
                            <FaBan />
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
                            <FaEdit />
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
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              {"<<"}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              {"<"}
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              {">"}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              {">>"}
            </button>
          </div>

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
      </div>

      {/* Section 2: Add New Product */}
      <div style={{ marginTop: "10px" }}>
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
          Add New Product
        </button>
        <div>
          <h1
            style={{
              marginBottom: "10px",
              textAlign: "center",
              fontSize: "24px",
              margin: "5px",
            }}
          >
            Add New Product
          </h1>

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
              bottom: "40px",
              right: "40px",
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
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
                htmlFor="category"
                style={{ fontWeight: "bold", color: "#888", margin: "0" }}
              >
                Category:
              </label>
              <select
                id="category"
                value={selectedOptions.category || ""}
                onChange={(e) => handleOptionSelect("category", e.target.value)}
                style={{
                  outline: "none",
                  border: "none",
                  flex: 1,
                  color: selectedOptions.category ? "#008CBA" : "#aaa",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                }}
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
                htmlFor="scent"
                style={{ fontWeight: "bold", color: "#888", margin: "0" }}
              >
                Scent:
              </label>
              <select
                id="scent"
                value={selectedOptions.scent || ""}
                onChange={(e) => handleOptionSelect("scent", e.target.value)}
                style={{
                  outline: "none",
                  border: "none",
                  flex: 1,
                  color: selectedOptions.scent ? "#008CBA" : "#aaa",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                }}
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
                htmlFor="color"
                style={{ fontWeight: "bold", color: "#888", margin: "0" }}
              >
                Color:
              </label>
              <select
                id="color"
                value={selectedOptions.color || ""}
                onChange={(e) => handleOptionSelect("color", e.target.value)}
                style={{
                  outline: "none",
                  border: "none",
                  flex: 1,
                  color: selectedOptions.color ? "#008CBA" : "#aaa",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                }}
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
              marginTop: "10px",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {showValidationError && (
              <div className="error-message">
                Please fill in all required fields before adding the product.
              </div>
            )}

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
                position: "absolute",
                bottom: "10px",
                right: "10px",
                top: "10px",
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
  );
};

export default ProductList;
