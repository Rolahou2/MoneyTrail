import React, { useState, useEffect } from "react";
import productlogo from "../assets/product2.png";

const Sales = () => {
  const [products, setProducts] = useState([]); // Fetched products for dropdown
  const [sales, setSales] = useState([]); // Fetched products for dropdown
  const [newSales, setNewSales] = useState([]); // Sales entries
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const [showValidationError, setShowValidationError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newSale, setNewSale] = useState({
    transactions: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    dateOfPurchase: "",
    businessType: "",
    productname: "",
    isWithBottle: true,
    quantity: "",
    unitprice: "",
    totalamount: "",
  });

  // Fetch products from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        await Promise.all([fetchProducts(), fetchSales()]);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchData();
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

  const fetchSales = async () => {
    try {
      const response = await fetch("/api/sales");
      if (!response.ok) throw new Error("Failed to fetch sales");
      const data = await response.json();
      const salesWithEditingState = data.map((sale) => ({
        ...sale,
        isEditing: false,
      }));

      setSales(salesWithEditingState);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const isValidSale = (sale) => {
    return (
      sale.dateOfPurchase &&
      sale.businessType &&
      sale.productname &&
      sale.isWithBottle !== null &&
      sale.quantity &&
      sale.unitprice &&
      sale.totalamount
    );
  };

  const handleInputChange = (field, value) => {
    setNewSale((prev) => {
      let updatedSale = { ...prev, [field]: value };

      // Update unit price if productname or isWithBottle changes
      if (field === "productname" || field === "isWithBottle") {
        const selectedProduct = products.find(
          (product) => product.productname === updatedSale.productname
        );
        if (selectedProduct) {
          updatedSale.unitprice = updatedSale.isWithBottle
            ? selectedProduct.sellPriceLLwithBottle
            : selectedProduct.sellPriceLLwithoutBottle;
        }
      }

      // Recalculate total amount if quantity, unitprice, or isWithBottle changes
      if (
        (field === "quantity" ||
          field === "unitprice" ||
          field === "isWithBottle") &&
        updatedSale.isWithBottle
      ) {
        const quantity = parseFloat(updatedSale.quantity) || 0;
        const unitprice = parseFloat(updatedSale.unitprice) || 0;
        updatedSale.totalamount = (quantity * unitprice).toFixed(2);
      }

      return updatedSale;
    });
  };

  const handleAddSale = () => {
    if (!isValidSale(newSale)) {
      setShowValidationError(true);
      return;
    }
    const saleWithEditing = { ...newSale, isEditing: false };
    setNewSales((prev) => [saleWithEditing, ...prev]); // Add the new sale to the list
    setNewSale({
      transactions: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // Generate a new transaction ID
      dateOfPurchase: "",
      businessType: "",
      productname: "",
      isWithBottle: true,
      quantity: "",
      unitprice: "",
      totalamount: "",
    }); // Reset form
    setShowValidationError(false);
  };

  const handleSaveSales = async () => {
    try {
      const validNewSales = newSales.filter((sale) => isValidSale(sale));

      if (validNewSales.length === 0) {
        console.error("No valid sales to save.");
        return;
      }

      const responses = await Promise.all(
        validNewSales.map((sale) =>
          fetch("/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sale),
          })
        )
      );

      const failedResponses = responses.filter((res) => !res.ok);
      if (failedResponses.length > 0) {
        throw new Error("Some sales failed to save");
      }

      const savedSales = await Promise.all(responses.map((res) => res.json()));
      setSales((prev) => [...savedSales, ...prev]);
      setNewSales([]); // Clear form
      setSuccessMessage("Sales saved successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving sales:", error);
    }
  };

  const confirmDelete = (idOrIndex, isNewSale) => {
    console.log(
      `Confirm delete: ID or Index: ${idOrIndex}, isNew: ${isNewSale}`
    );
    setDeleteTarget({ idOrIndex, isNewSale });
  };

  const handleDeleteSale = async (idOrIndex, isNewSale = false) => {
    if (isNewSale) {
      // Handle deletion of a new sale (client-side only)
      const updatedNewSales = newSales.filter((_, i) => i !== idOrIndex);
      setNewSales(updatedNewSales);
    } else {
      try {
        if (!idOrIndex) {
          console.error("Invalid ID provided for deletion:", idOrIndex);
          return;
        }

        const response = await fetch(`/api/sales/${idOrIndex}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete sales from the database");
        }

        const updatedSales = sales.filter((sale) => sale._id !== idOrIndex);
        setSales(updatedSales);
      } catch (error) {
        console.error("Error deleting sale:", error);
      }
    }

    setDeleteTarget(null); // Close the delete modal after deletion
  };

  const saveEdit = async (sale, index, isNew) => {
    try {
      if (isNew) {
        const updatedNewSales = [...newSales];
        updatedNewSales[index].isEditing = false;
        setNewSales(updatedNewSales);
      } else {
        const response = await fetch(`/api/sales/${sale._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sale),
        });

        if (!response.ok) {
          throw new Error("Failed to update sale");
        }

        const updatedSales = sales.map((s) =>
          s._id === sale._id ? { ...sale, isEditing: false } : s
        );
        setSales(updatedSales);
      }
    } catch (error) {
      console.error("Error saving sale:", error);
    }
  };

  const handleEditChange = (index, field, value, isNew) => {
    if (isNew) {
      const updatedNewSales = [...newSales];
      updatedNewSales[index] = { ...updatedNewSales[index], [field]: value };

      // Recalculate dependent fields for new sales
      if (field === "isWithBottle" || field === "productname") {
        const selectedProduct = products.find(
          (product) =>
            product.productname === updatedNewSales[index].productname
        );
        if (selectedProduct) {
          updatedNewSales[index].unitprice = updatedNewSales[index].isWithBottle
            ? selectedProduct.sellPriceLLwithBottle
            : selectedProduct.sellPriceLLwithoutBottle;
        }
      }
      if (
        (field === "quantity" ||
          field === "unitprice" ||
          field === "isWithBottle") &&
        updatedNewSales[index].isWithBottle
      ) {
        const quantity = parseFloat(updatedNewSales[index].quantity) || 0;
        const unitprice = parseFloat(updatedNewSales[index].unitprice) || 0;
        updatedNewSales[index].totalamount = (quantity * unitprice).toFixed(2);
      }

      setNewSales(updatedNewSales);
    } else {
      const updatedSales = [...sales];
      updatedSales[index] = { ...updatedSales[index], [field]: value };

      // Recalculate dependent fields for existing sales
      if (field === "isWithBottle" || field === "productname") {
        const selectedProduct = products.find(
          (product) => product.productname === updatedSales[index].productname
        );
        if (selectedProduct) {
          updatedSales[index].unitprice = updatedSales[index].isWithBottle
            ? selectedProduct.sellPriceLLwithBottle
            : selectedProduct.sellPriceLLwithoutBottle;
        }
      }
      if (
        (field === "quantity" ||
          field === "unitprice" ||
          field === "isWithBottle") &&
        updatedSales[index].isWithBottle
      ) {
        const quantity = parseFloat(updatedSales[index].quantity) || 0;
        const unitprice = parseFloat(updatedSales[index].unitprice) || 0;
        updatedSales[index].totalamount = (quantity * unitprice).toFixed(2);
      }

      setSales(updatedSales);
    }
  };

  const handleEditClick = (sale, index, isNew) => {
    if (isNew) {
      const updatedNewSales = newSales.map((s, i) =>
        i === index ? { ...s, isEditing: true } : s
      );
      setNewSales(updatedNewSales);
    } else {
      const updatedSales = sales.map((s) =>
        s._id === sale._id ? { ...s, isEditing: true } : s
      );
      setSales(updatedSales);
    }
  };

  const cancelEdit = (index, isNew) => {
    if (isNew) {
      const updatedNewSales = [...newSales];
      updatedNewSales[index].isEditing = false;
      setNewSales(updatedNewSales);
    } else {
      const updatedSales = [...sales];
      updatedSales[index - newSales.length].isEditing = false;
      setSales(updatedSales);
    }
  };

  return (
    <div className="subpages-container">
      {/* Top Row: Sales Entry form*/}
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <section className="entry-section">
            {/* Left: Image */}
            <div className="bottle-image-container">
              <img src={productlogo} alt="Bottle" classname="bottle-image" />
            </div>
            {/* Middle: Entry Fields */}
            <div className="entry-container">
              <div className="entry-title">
                <h2>Sales Form</h2>
              </div>
              <div className="entry-fields">
                <div className="entry-group">
                  <label htmlFor="dateOfPurchase">Date of Purchase</label>
                  <input
                    type="date"
                    id="dateOfPurchase"
                    className={`entry-input ${
                      showValidationError && !newSale.dateOfPurchase
                        ? "input-error"
                        : ""
                    }`}
                    value={newSale.dateOfPurchase}
                    onChange={(e) =>
                      handleInputChange("dateOfPurchase", e.target.value)
                    }
                  />
                </div>

                <div className="entry-group">
                  <label htmlFor="businessType">Business Type</label>
                  <select
                    id="businessType"
                    className={`entry-input ${
                      showValidationError && !newSale.businessType
                        ? "input-error"
                        : ""
                    }`}
                    value={newSale.businessType}
                    onChange={(e) =>
                      handleInputChange("businessType", e.target.value)
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                  </select>
                </div>

                <div className="entry-group">
                  <label htmlFor="productname">Product Name</label>
                  <select
                    type="text"
                    id="productname"
                    className={`entry-input ${
                      showValidationError && !newSale.productname
                        ? "input-error"
                        : ""
                    }`}
                    value={newSale.productname}
                    onChange={(e) =>
                      handleInputChange("productname", e.target.value)
                    }
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product.productname}>
                        {product.productname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="entry-group">
                  <label htmlFor="isWithBottle">With Bottle</label>
                  <select
                    type="text"
                    id="isWithBottle"
                    className="entry-input"
                    value={newSale.isWithBottle ? "true" : "false"}
                    onChange={(e) =>
                      handleInputChange(
                        "isWithBottle",
                        e.target.value === "true"
                      )
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="entry-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    className={`entry-input ${
                      showValidationError && !newSale.quantity
                        ? "input-error"
                        : ""
                    }`}
                    value={newSale.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                  />
                </div>

                <div className="entry-group">
                  <label htmlFor="unitprice">Unit Price</label>
                  <input
                    type="number"
                    id="unitprice"
                    className="entry-input"
                    value={newSale.unitprice}
                    readOnly
                  />
                </div>

                <div className="entry-group">
                  <label htmlFor="totalamount">Total Amount</label>
                  <input
                    type="number"
                    id="totalamount"
                    className="entry-input"
                    value={newSale.totalamount}
                    onChange={(e) =>
                      !newSale.isWithBottle
                        ? handleInputChange("totalamount", e.target.value)
                        : null
                    }
                    readOnly={newSale.isWithBottle}
                  />
                </div>
              </div>
            </div>
            {/* Right: Buttons */}
            <div className="entry-actions">
              {/* Validation Message */}
              {showValidationError && (
                <div className="error-message">
                  Please fill in all required fields before adding the sale.
                </div>
              )}
              <button className="add-button" onClick={handleAddSale}>
                Add Sale
              </button>
              <button
                className="save-button"
                onClick={() => {
                  console.log("Save button clicked");
                  handleSaveSales();
                }}
              >
                Save
              </button>
            </div>
          </section>

          {/* Bottom Row: Sales Recpords */}
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-2 bg-green-200 text-green-700 rounded-lg text-center">
              {successMessage}
            </div>
          )}
          <section className="entry-section">
            <div className="entry-title">
              <h2>Sales Records</h2>
            </div>
            <table>
              <thead>
                <tr className="border border-gray-300">
                  <th className="border border-gray-300 p-2 text-center align-middle">
                    Transactions
                  </th>
                  <th className="border border-gray-300 p-2 text-center align-middle">
                    Date of Purchase
                  </th>
                  <th className="border border-gray-300 p-2 text-center align-middle">
                    Business Type
                  </th>
                  <th
                    style={{
                      width: "200px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                    className="border border-gray-300 p-2 text-center align-middle"
                  >
                    Product Name
                  </th>
                  <th className="border border-gray-300 p-2 text-center align-middle">
                    With Bottle
                  </th>
                  <th className="border border-gray-300 p-2 text-center align-middle">
                    Quantity
                  </th>
                  <th className="border border-gray-300 p-2 text-center align-middle">
                    Unit Price
                  </th>
                  <th className="border border-gray-300 p-2 text-center align-middle">
                    Total Amount
                  </th>
                  <th className="border border-gray-300 p-2 text-center align-middle">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...newSales.map((sale, index) => ({
                    ...sale,
                    index,
                    isNew: true,
                  })),
                  ...sales.map((sale, index) => ({
                    ...sale,
                    index,
                    isNew: false,
                  })),
                ]
                  .sort((a, b) => {
                    const dateA = new Date(a.dateOfPurchase).getTime();
                    const dateB = new Date(b.dateOfPurchase).getTime();
                    return dateB - dateA; // Descending order
                  })
                  .map((sale) => (
                    <tr
                      key={sale._id || `new-${sale.index}`}
                      className={`border border-gray-300 ${
                        !sale._id ? "bg-yellow-100" : ""
                      }`}
                    >
                      {sale.isEditing ? (
                        <>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <input
                              type="text"
                              value={sale.transactions}
                              readOnly
                              className="edit-input"
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <input
                              type="date"
                              value={sale.dateOfPurchase}
                              onChange={(e) =>
                                handleEditChange(
                                  sale.index,
                                  "dateOfPurchase",
                                  e.target.value,
                                  sale.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <input
                              type="text"
                              value={sale.businessType}
                              onChange={(e) =>
                                handleEditChange(
                                  sale.index,
                                  "businessType",
                                  e.target.value,
                                  sale.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <input
                              type="text"
                              value={sale.productname}
                              onChange={(e) =>
                                handleEditChange(
                                  sale.index,
                                  "productname",
                                  e.target.value,
                                  sale.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <select
                              value={sale.isWithBottle ? "true" : "false"}
                              onChange={(e) =>
                                handleEditChange(
                                  sale.index,
                                  "isWithBottle",
                                  e.target.value === "true",
                                  sale.isNew
                                )
                              }
                              className="edit-input"
                            >
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <input
                              type="number"
                              value={sale.quantity}
                              onChange={(e) =>
                                handleEditChange(
                                  sale.index,
                                  "quantity",
                                  e.target.value,
                                  sale.isNew
                                )
                              }
                              className="edit-input"
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <input
                              type="number"
                              value={sale.unitprice}
                              readOnly
                              className="edit-input"
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <input
                              type="number"
                              value={sale.totalamount}
                              onChange={(e) =>
                                !sale.isWithBottle
                                  ? handleEditChange(
                                      sale.index,
                                      "totalamount",
                                      e.target.value,
                                      sale.isNew
                                    )
                                  : null
                              }
                              readOnly={sale.isWithBottle}
                              className="edit-input"
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "5px",
                              }}
                            >
                              <button
                                onClick={() =>
                                  saveEdit(sale, sale.index, sale.isNew)
                                }
                                className="savetb-button"
                              >
                                Save
                              </button>
                              <button
                                onClick={() =>
                                  cancelEdit(sale.index, sale.isNew)
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
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            {sale.transactions}
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            {
                              new Date(sale.dateOfPurchase)
                                .toISOString()
                                .split("T")[0]
                            }
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            {sale.businessType}
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            {sale.productname}
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            {sale.isWithBottle ? "Yes" : "No"}
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            {sale.quantity}
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            {sale.unitprice}
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            {sale.totalamount}
                          </td>
                          <td className="border border-gray-300 p-2 text-center align-middle">
                            <div className="actions-buttons">
                              <button
                                className="edit-button"
                                onClick={() =>
                                  handleEditClick(sale, sale.index, sale.isNew)
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="delete-button"
                                onClick={() =>
                                  confirmDelete(
                                    sale.isNew ? sale.index : sale._id,
                                    sale.isNew
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
          </section>

          {deleteTarget && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white text-black rounded-lg p-4 shadow-lg">
                <p className="mb-4">
                  Are you sure you want to delete this sale?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      handleDeleteSale(
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
        </>
      )}
    </div>
  );
};

export default Sales;
