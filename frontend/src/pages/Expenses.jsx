import React, { useState, useEffect } from "react";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpenses, setNewExpenses] = useState([]); // Array to store multiple new expenses
  const [deleteTarget, setDeleteTarget] = useState(null);
  const categories = [
    "Purchases & Supplies",
    "Travel & Transportation",
    "Course & Consultation Fees",
    "Regular Facility Expenses",
    "Irregular Facility Expenses",
  ];
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch expenses from backend
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      console.log(response);
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const confirmDelete = (idOrIndex, isNewExpense) => {
    setDeleteTarget({ idOrIndex, isNewExpense });
  };

  const handleDeleteExpense = async (idOrIndex, isNewExpense = false) => {
    if (isNewExpense) {
      // Handle deletion of a new expense (client-side only)
      const updatedNewExpenses = newExpenses.filter((_, i) => i !== idOrIndex);
      setNewExpenses(updatedNewExpenses);
    } else {
      try {
        const response = await fetch(`/api/expenses/${idOrIndex}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete expense from the database");
        }

        // Remove the expense from the UI state
        setExpenses(expenses.filter((expense) => expense._id !== idOrIndex));
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
    setDeleteTarget(null); // Close the modal after deletion
  };

  // Function to handle change for dynamic rows
  const handleExpenseChange = (index, data, isNewExpense = false) => {
    if (isNewExpense) {
      // Handle changes for new expenses
      const updatedNewExpenses = [...newExpenses];
      const fieldName = data.target.name;
      const value = data.target.value;

      updatedNewExpenses[index] = {
        ...updatedNewExpenses[index],
        [fieldName]: value, // Merge updated fields into the specific new expense
      };
      setNewExpenses(updatedNewExpenses);
    } else {
      // Handle changes for existing expenses
      const updatedExpenses = [...expenses];
      const expenseIndex = expenses.findIndex(
        (expense) => expense._id === index
      );
      if (expenseIndex !== -1) {
        updatedExpenses[expenseIndex] = {
          ...updatedExpenses[expenseIndex],
          ...data, // Merge updated fields into the specific existing expense
        };
        setExpenses(updatedExpenses);
      }
    }
  };

  // Add a new empty row for adding a expense
  const handleAddRow = () => {
    setNewExpenses([
      ...newExpenses,
      {
        dateOfExpense: "",
        category: "",
        description: "",
        weightInGrams: "",
        paidInLL: "",
        exchangeRate: "",
        paidInUSD: "",
        unitPriceInUSD: "",
      },
    ]);
  };

  // Save all new expenses to the backend
  const handleSaveAllExpenses = async () => {
    console.log("Saving expenses:", newExpenses);
    try {
      const validNewExpenses = newExpenses.filter(
        (expense) =>
          expense.dateOfExpense &&
          expense.category &&
          expense.description &&
          expense.weightInGrams &&
          expense.paidInLL &&
          expense.exchangeRate &&
          expense.paidInUSD &&
          expense.unitPriceInUSD
      );
      console.log("Valid expenses to save:", validNewExpenses);
      if (validNewExpenses.length === 0) {
        console.error("No valid expenses to save.");
        return;
      }

      const responses = await Promise.all(
        validNewExpenses.map((expense) =>
          fetch("/api/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense),
          })
        )
      );

      const failedResponses = responses.filter((res) => !res.ok);
      if (failedResponses.length > 0) {
        throw new Error("Some expenses failed to save");
      }

      const savedExpenses = await Promise.all(
        responses.map((res) => res.json())
      );
      setExpenses((prev) => [...prev, ...savedExpenses]);
      setNewExpenses([]);
      setSuccessMessage("Expenses saved successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving expenses:", error);
    }
  };

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-700 rounded-lg text-center">
          {successMessage}
        </div>
      )}

      <ul className="flex mb-4 float-right gap-4 p-6">
        <button
          onClick={handleAddRow}
          className="text-orange-700 border bg-orange-200 rounded-lg p-2 h-10 w-24 font-semibold hover:opacity-80"
        >
          Add
        </button>

        <button
          onClick={() => {
            console.log("Save button clicked");
            handleSaveAllExpenses();
          }}
          className="text-green-600 border bg-green-100 rounded-lg p-2 h-10 w-24 font-semibold hover:opacity-80"
        >
          Save
        </button>
      </ul>

      <main className="quick-entry-input">
        <h1 className="sales-title">Overview</h1>
        {/* Table to display expenses */}
        <table
          style={{ tableLayout: "fixed", width: "100%" }}
          className="sales-table"
        >
          <thead>
            <tr className="border border-gray-300">
              <th className="border border-gray-300 p-2 text-center align-middle">
                Expense Date
              </th>
              <th className="border border-gray-300 p-2 text-center align-middle">
                Category
              </th>
              <th className="border border-gray-300 p-2 text-center align-middle">
                Description
              </th>
              <th className="border border-gray-300 p-2 text-center align-middle">
                Weight in Grams
              </th>
              <th className="border border-gray-300 p-2 text-center align-middle">
                Paid in LL
              </th>
              <th className="border border-gray-300 p-2 text-center align-middle">
                Exchange Rate
              </th>
              <th className="border border-gray-300 p-2 text-center align-middle">
                Paid ($)
              </th>
              <th className="border border-gray-300 p-2 text-center align-middle">
                Unit Price ($)
              </th>
              <th className="border border-gray-300 p-2 text-center align-middle">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Render existing expenses */}
            {expenses.map((expense) => (
              <tr key={expense._id} className="border border-gray-300">
                <td className="border border-gray-300 p-2 text-center align-middle">
                  {expense.dateOfExpense}
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <select
                    value={expense.category}
                    onChange={(e) =>
                      handleExpenseChange(
                        expense._id,
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
                  {expense.description}
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  {expense.weightInGrams}
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  {expense.paidInLL}
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  {expense.exchangeRate}
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  {expense.paidInUSD}
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  {expense.unitPriceInUSD}
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <button
                    onClick={() => confirmDelete(expense._id, false)}
                    className="text-red-700 border bg-red-300 rounded-lg p-1 hover:opacity-80"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Render rows for new expenses with delete option */}
            {newExpenses.map((expense, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="date"
                    name="dateOfExpense"
                    value={expense.dateOfExpense}
                    onChange={(e) => handleExpenseChange(index, e, true)}
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <select
                    name="category"
                    value={expense.category}
                    onChange={(e) => handleExpenseChange(index, e, true)}
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
                    name="description"
                    placeholder="Enter value"
                    value={expense.description}
                    onChange={(e) => handleExpenseChange(index, e, true)}
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="number"
                    name="weightInGrams"
                    placeholder="Enter value"
                    value={expense.weightInGrams}
                    onChange={(e) => handleExpenseChange(index, e, true)}
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="number"
                    name="paidInLL"
                    placeholder="Enter value"
                    value={expense.paidInLL}
                    onChange={(e) => handleExpenseChange(index, e, true)}
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="number"
                    name="exchangeRate"
                    placeholder="Enter value"
                    value={expense.exchangeRate}
                    onChange={(e) => handleExpenseChange(index, e, true)}
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="number"
                    name="paidInUSD"
                    placeholder="Enter value"
                    value={expense.paidInUSD}
                    onChange={(e) => handleExpenseChange(index, e, true)}
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <input
                    type="number"
                    name="unitPriceInUSD"
                    placeholder="Enter value"
                    value={expense.unitPriceInUSD}
                    onChange={(e) => handleExpenseChange(index, e, true)}
                    className="w-full text-center align-middle"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-center align-middle">
                  <button
                    onClick={() => confirmDelete(index, true)}
                    className="text-red-700 border bg-red-300 rounded-lg p-1 hover:opacity-80"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {/* Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="mb-4">
              Are you sure you want to delete this expense?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  handleDeleteExpense(
                    deleteTarget.idOrIndex,
                    deleteTarget.isNewExpense
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

export default Expenses;
