import React, { useState, useEffect } from "react";

const Sales = () => {
  const [products, setProducts] = useState([]); // Fetched products for dropdown
  const [sales, setSales] = useState([]); // Fetched products for dropdown
  const [newSales, setNewSales] = useState([]); // Sales entries
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
    fetchSales();
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
      console.log(data);
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const handleAddRow = () => {
    const generateTransactionId = () => {
      return `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    };

    setNewSales([
      ...newSales,
      {
        transactions: generateTransactionId(),
        dateOfPurchase: "",
        businessType: "",
        productname: "",
        isWithBottle: true,
        quantity: "",
        unitprice: "",
        totalamount: "",
      },
    ]);
  };

  const handleSalesChange = (index, field, value) => {
    const updatedSales = [...newSales];
    updatedSales[index] = {
      ...updatedSales[index],
      [field]: value,
    };

    // Update unitprice based on isWithBottle and selected product
    if (field === "isWithBottle" || field === "productname") {
      const selectedProduct = products.find(
        (product) => product.productname === updatedSales[index].productname
      );

      if (selectedProduct) {
        updatedSales[index].unitprice =
          value === true || updatedSales[index].isWithBottle === true
            ? selectedProduct.sellPriceLLwithBottle
            : selectedProduct.sellPriceLLwithoutBottle;
      }
    }

    // Automatically calculate totalamount only when isWithBottle is true
    if (
      (field === "quantity" ||
        field === "unitprice" ||
        field === "isWithBottle") &&
      updatedSales[index].isWithBottle === true
    ) {
      const quantity = parseFloat(updatedSales[index].quantity) || 0;
      const unitprice = parseFloat(updatedSales[index].unitprice) || 0;
      updatedSales[index].totalamount = (quantity * unitprice).toFixed(2);
    }

    setNewSales(updatedSales);
  };

  const handleSaveSales = async () => {
    try {
      const validNewSales = newSales.filter(
        (sale) =>
          sale.transactions &&
          sale.dateOfPurchase &&
          sale.businessType &&
          sale.productname &&
          sale.quantity &&
          sale.unitprice &&
          sale.totalamount
      );

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
      setSales((prev) => [...prev, ...savedSales]);
      setNewSales([]); // Clear form
      setSuccessMessage("Sales saved successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving sales:", error);
    }
  };

  const confirmDelete = (idOrIndex, isNewSale) => {
    setDeleteTarget({ idOrIndex, isNewSale });
  };

  const handleDeleteSale = async (idOrIndex, isNewSale = false) => {
    if (isNewSale) {
      // Handle deletion of a new product (client-side only)
      const updatedNewSales = newSales.filter((_, i) => i !== idOrIndex);
      setNewSales(updatedNewSales);
    } else {
      try {
        const response = await fetch(`/api/sales/${idOrIndex}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete sales from the database");
        }

        // Remove the product from the UI state
        setSales(sales.filter((sale) => sale._id !== idOrIndex));
      } catch (error) {
        console.error("Error deleting sale:", error);
      }
    }
    setDeleteTarget(null); // Close the modal after deletion
  };

  return (
    <div className="sales-page-container">
      {/* Top Row: Quick Entry */}
      <header className="quick-entry-section">
        <h1 className="sales-title">Quick Entry</h1>
        <div className="quick-entry">
        <div className="quick-entry-group">
          <label>Date of Purchase</label>
          <input
            type="date"
            onChange={(e) => console.log(e.target.value)}
            className="quick-entry-input"
          />
        </div>
        <div className="quick-entry-group">
          <label>Business Type</label>
          <select className="quick-entry-input">
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
          </select>
        </div>
        <div className="quick-entry-group">
          <label>With Bottle</label>
          <select className="quick-entry-input">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="quick-entry-group">
          <label>Quantity</label>
          <input type="number" className="quick-entry-input" />
        </div>
        <div className="quick-entry-group">
          <label>Unit Price</label>
          <input
            type="text"
            className="quick-entry-input"
            readOnly
            value="360000"
          />
        </div>
        <div className="quick-entry-group">
          <label>Total Amount</label>
          <input
            type="text"
            className="quick-entry-input"
          />
        </div>
        <div className="quick-entry-actions">
          <button onClick={handleAddRow} className="add-button">
            Add Sale
          </button>
          <button onClick={handleSaveSales} className="save-button">
            Save
          </button>
        </div>
      </div>
    </header>

      {/* Bottom Row: Sales Table */}
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-700 rounded-lg text-center">
          {successMessage}
        </div>
      )}
      <main className="sales-table-section">
      <h1 className="sales-title">Overview</h1>
        <table className="sales-table">
          <thead>
            <tr className="border border-gray-300">
              <th className="border border-gray-300 p-2 text-center align-middle">
                Transaction
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
            {/* Render existing sales */}
            {sales.map((sale) => (
              <tr key={sale._id} className="border border-gray-300">
                <td className="border border-gray-300 p-2 text-center align-middle">
                  {sale.transactions}
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  {new Date(sale.dateOfPurchase).toISOString().split("T")[0]}
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
                  <button
                    onClick={() => confirmDelete(product._id, false)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Render rows for new sales with delete option */}
            {newSales.map((sale, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 p-2 text-center align-middle">
                  {sale.transactions}{" "}
                  {/* Display the generated transaction ID */}
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="date"
                    name="dateOfPurchase"
                    value={sale.dateOfPurchase}
                    onChange={(e) =>
                      handleSalesChange(index, "dateOfPurchase", e.target.value)
                    }
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="text"
                    value={sale.businessType}
                    name="businessType"
                    placeholder="Enter value"
                    onChange={(e) =>
                      handleSalesChange(index, "businessType", e.target.value)
                    }
                    className="w-full text-center align-middle"
                  />
                </td>
                <td
                  style={{ wordWrap: "break-word", whiteSpace: "normal" }}
                  className="border border-gray-300 p-2 text-center align-middle"
                >
                  <select
                    value={sale.productname}
                    name="productname"
                    onChange={(e) =>
                      handleSalesChange(index, "productname", e.target.value)
                    }
                    className="w-full text-center align-middle"
                  >
                    <option value="" disabled>
                      Select Product
                    </option>
                    {products.map((product) => (
                      <option key={product._id} value={product.productname}>
                        {product.productname}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <select
                    value={sale.isWithBottle}
                    name="isWithBottle"
                    onChange={(e) =>
                      handleSalesChange(
                        index,
                        "isWithBottle",
                        e.target.value === "true"
                      )
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="number"
                    value={sale.quantity}
                    name="quantity"
                    placeholder="Enter value"
                    onChange={(e) =>
                      handleSalesChange(index, "quantity", e.target.value)
                    }
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="number"
                    name="unitprice"
                    placeholder="Enter value"
                    value={sale.unitprice}
                    readOnly
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="number"
                    name="totalamount"
                    placeholder="Enter value"
                    value={sale.totalamount}
                    onChange={(e) =>
                      !sale.isWithBottle
                        ? handleSalesChange(
                            index,
                            "totalamount",
                            e.target.value
                          )
                        : null
                    }
                    readOnly={sale.isWithBottle}
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <button
                    onClick={() => confirmDelete(index, true)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-black rounded-lg p-4 shadow-lg">
            <p className="mb-4">Are you sure you want to delete this sale?</p>
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
    </div>
  );
};

export default Sales;
