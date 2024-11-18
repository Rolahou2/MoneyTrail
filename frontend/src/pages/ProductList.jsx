import React, { useState, useEffect } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]); // Array to store multiple new products
  const [deleteTarget, setDeleteTarget] = useState(null);
  const categories = [
    "Handwash",
    "Laundry Detergent",
    "Floor Cleaner",
    "Dish Soap",
    "Odex Cleaner",
    "Flash Cleaner",
  ];
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const confirmDelete = (idOrIndex, isNewProduct) => {
    setDeleteTarget({ idOrIndex, isNewProduct });
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
        setProducts(products.filter((product) => product._id !== idOrIndex));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    setDeleteTarget(null); // Close the modal after deletion
  };

  // Function to handle change for dynamic rows
  const handleProductChange = async (
    idOrIndex,
    updatedDataOrEvent,
    isNewProduct = false
  ) => {
    if (isNewProduct) {
      const { name, value } = updatedDataOrEvent.target;

      const sanitizedValue =
        name === "cost" ||
        name === "totalcost" ||
        name === "sellPriceLLwithBottle" ||
        name === "sellPriceLLwithoutBottle"
          ? value.replace(/[^0-9.]/g, "")
          : value;

      const updatedNewProducts = [...newProducts];
      updatedNewProducts[idOrIndex] = {
        ...updatedNewProducts[idOrIndex],
        [name]: sanitizedValue,
      };

      const { category, scent, color } = updatedNewProducts[idOrIndex];
      updatedNewProducts[idOrIndex].productname = `${category || ""}_${
        scent || ""
      }_${color || ""}`;

      setNewProducts(updatedNewProducts);
    } else {
      const updatedData = { ...updatedDataOrEvent };

      Object.keys(updatedData).forEach((key) => {
        updatedData[key] =
          key === "cost" ||
          key === "totalcost" ||
          key === "sellPriceLLwithBottle" ||
          key === "sellPriceLLwithoutBottle"
            ? updatedData[key].toString().replace(/[^0-9.]/g, "")
            : updatedData[key];
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === idOrIndex
            ? {
                ...product,
                ...updatedData,
                productname: `${updatedData.category || product.category}_${
                  updatedData.scent || product.scent
                }_${updatedData.color || product.color}`,
                hasBeenModified: true,
              }
            : product
        )
      );
    }
  };

  // Add a new empty row for adding a product
  const handleAddRow = () => {
    setNewProducts([
      ...newProducts,
      {
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
      },
    ]);
  };

  // Save all new products to the backend
  const handleSaveAllProducts = async () => {
    try {
      const validNewProducts = newProducts.filter(
        (product) =>
          product.productId &&
          product.category &&
          product.scent &&
          product.color &&
          product.productname &&
          product.botlesize &&
          product.cost &&
          product.totalcost &&
          product.sellPriceLLwithBottle &&
          product.sellPriceLLwithoutBottle
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
      setProducts((prev) => [...prev, ...savedProducts]);
      setNewProducts([]);
      setSuccessMessage("Products saved successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving products:", error);
    }
  };

  const handleBlurSellPriceLL = (idOrIndex, isNewProduct) => {
    console.log(`Blur triggered for ${isNewProduct ? "new" : "existing"} product at index/id: ${idOrIndex}`);
  
    const exchangeRate = 90000; // Example exchange rate for LL to USD
  
    if (isNewProduct) {
      const updatedNewProducts = [...newProducts];
      const sellPriceLL = parseFloat(updatedNewProducts[idOrIndex].sellPriceLLwithBottle) || 0;
  
      updatedNewProducts[idOrIndex].sellPriceUSDwithBottle = (sellPriceLL / exchangeRate).toFixed(2);
      console.log(`Updated new product:`, updatedNewProducts[idOrIndex]);
  
      setNewProducts(updatedNewProducts);
    } else {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === idOrIndex
            ? {
                ...product,
                sellPriceUSDwithBottle: (parseFloat(product.sellPriceLLwithBottle || 0) / exchangeRate).toFixed(2),
              }
            : product
        )
      );
  
      console.log(`Updated existing product.`);
    }
  };
  

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-lg text-center">
          {successMessage}
        </div>
      )}

      <ul className="flex mb-4 float-right gap-4 p-6">
        <button
          onClick={handleAddRow}
          className="text-orange-600 border bg-orange-100 rounded-lg p-2 h-10 w-24 font-semibold"
        >
          Add
        </button>

        <button
          onClick={() => {
            console.log("Save button clicked");
            handleSaveAllProducts();
          }}
          className="text-green-600 border bg-green-100 rounded-lg p-2 h-10 w-24 font-semibold"
        >
          Save
        </button>
      </ul>

      {/* Table to display products */}
      <table
        style={{ tableLayout: "fixed", width: "100%" }}
        className="border-collapse border border-gray-300 w-full mt-4"
      >
        <thead>
          <tr className="border border-gray-300">
            <th className="border border-gray-300 p-2 text-center align-middle">
              Product ID
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Category
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Scent
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Color
            </th>
            <th
              className="border border-gray-300 p-2 text-center align-middle"
              style={{
                width: "200px",
                wordWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              Product Name
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Bottle Size
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Cost
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Total Cost
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Price with Bottle (LL)
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Price with Bottle ($)
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Price without Bottle (LL)
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Price without Bottle ($)
            </th>
            <th className="border border-gray-300 p-2 text-center align-middle">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Render existing products */}
          {products.map((product) => (
            <tr key={product._id} className="border border-gray-300">
              <td className="border border-gray-300 p-2 text-center align-middle">
                {product.productId}
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <select
                  value={product.category}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      { category: e.target.value },
                      false
                    )
                  }
                  className="w-full text-center align-middle"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  value={product.scent}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      {
                        scent: e.target.value,
                      },
                      false
                    )
                  }
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  value={product.color}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      {
                        color: e.target.value,
                      },
                      false
                    )
                  }
                  className="w-full text-center align-middle"
                />
              </td>
              <td
                className="border border-gray-300 p-2 text-center align-middle"
                style={{ wordWrap: "break-word", whiteSpace: "normal" }}
              >
                {product.productname}
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  value={product.botlesize}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      {
                        botlesize: e.target.value,
                      },
                      false
                    )
                  }
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  value={`$${product.cost}`}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      {
                        cost: e.target.value.replace(/^\$/, ""),
                      },
                      false
                    )
                  }
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  value={`$${product.totalcost}`}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      {
                        totalcost: e.target.value.replace(/^\$/, ""),
                      },
                      false
                    )
                  }
                  className="w-full text-center align-middle"
                />
              </td>
              <td
                type="number"
                className="border border-gray-300 p-2 text-center align-middle"
              >
                <input
                  type="number"
                  value={product.sellPriceLLwithBottle}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      {
                        sellPriceLLwithBottle: e.target.value,
                      },
                      false
                    )
                  }
                  onBlur={() => handleBlurSellPriceLL(product._id, false)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td
                type="number"
                className="border border-gray-300 p-2 text-center align-middle"
              >
                <input
                  type="text"
                  value={`$${(product.sellPriceLLwithBottle / 90000).toFixed(
                    2
                  )}`}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      {
                        sellPriceUSDwithBottle: e.target.value.replace(
                          /^\$/,
                          ""
                        ),
                      },
                      false
                    )
                  }
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="number"
                  value={product.sellPriceLLwithoutBottle}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      {
                        sellPriceLLwithoutBottle: e.target.value,
                      },
                      false
                    )
                  }
                  onBlur={() => handleBlurSellPriceLL(product._id, false)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td
                type="number"
                className="border border-gray-300 p-2 text-center align-middle"
              >
                <input
                  type="text"
                  value={`$${(product.sellPriceLLwithoutBottle / 90000).toFixed(
                    2
                  )}`}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      {
                        sellPriceUSDwithoutBottle: e.target.value.replace(
                          /^\$/,
                          ""
                        ),
                      },
                      false
                    )
                  }
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <button
                  onClick={() => confirmDelete(product._id, false)}
                  className="text-red-600 border bg-red-100 rounded-lg p-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {/* Render rows for new products with delete option */}
          {newProducts.map((product, index) => (
            <tr key={index} className="border border-gray-300">
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  name="productId"
                  placeholder="Enter value"
                  value={product.productId}
                  onChange={(e) => handleProductChange(index, e, true)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <select
                  name="category"
                  value={product.category}
                  onChange={(e) => handleProductChange(index, e, true)}
                  className="w-full text-center align-middle"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  name="scent"
                  placeholder="Enter value"
                  value={product.scent}
                  onChange={(e) => handleProductChange(index, e, true)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  name="color"
                  placeholder="Enter value"
                  value={product.color}
                  onChange={(e) => handleProductChange(index, e, true)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td
                className="border border-gray-300 p-2 text-center align-middle"
                style={{ wordWrap: "break-word", whiteSpace: "normal" }}
              >
                <input
                  type="text"
                  name="productname"
                  placeholder="Enter value"
                  value={product.productname}
                  onChange={(e) => handleProductChange(index, e, true)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="number"
                  name="botlesize"
                  placeholder="Enter value"
                  value={product.botlesize}
                  onChange={(e) => handleProductChange(index, e, true)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  name="cost"
                  placeholder="Enter value"
                  value={`$${product.cost}`}
                  onChange={(e) => handleProductChange(index, e, true)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  name="totalcost"
                  placeholder="Enter value"
                  value={`$${product.totalcost}`}
                  onChange={(e) => handleProductChange(index, e, true)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="number"
                  name="sellPriceLLwithBottle"
                  placeholder="Enter value"
                  value={product.sellPriceLLwithBottle}
                  onChange={(e) => handleProductChange(index, e, true)}
                  onBlur={() => handleBlurSellPriceLL(index, true)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  value={`$${(product.sellPriceLLwithBottle / 90000).toFixed(
                    2
                  )}`}
                  readOnly
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="number"
                  name="sellPriceLLwithoutBottle"
                  placeholder="Enter value"
                  value={product.sellPriceLLwithoutBottle}
                  onChange={(e) => handleProductChange(index, e, true)}
                  onBlur={() => handleBlurSellPriceLL(index, true)}
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <input
                  type="text"
                  value={`$${(product.sellPriceLLwithoutBottle / 90000).toFixed(
                    2
                  )}`}
                  readOnly
                  className="w-full text-center align-middle"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center align-middle">
                <button
                  onClick={() => confirmDelete(index, true)}
                  className="text-red-600 border bg-red-100 rounded-lg p-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="mb-4">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  handleDeleteProduct(
                    deleteTarget.idOrIndex,
                    deleteTarget.isNewProduct
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
  );
};

export default ProductList;
