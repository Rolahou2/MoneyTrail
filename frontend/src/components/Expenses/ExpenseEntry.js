import React, { useState } from 'react';
import { postExpense } from '../../api/api'; // Import the API function to send data to the backend

const ExpenseEntry = () => {
  const [expense, setExpense] = useState({
    category: '',
    description: '',
    weightinGrams: '',
    date: '',
    paymentinLL: '',
    paymentinUSD: '',
    ExchangeRate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that at least one of paymentinLL or paymentinUSD is provided
    if (!expense.paymentinLL && !expense.paymentinUSD) {
      alert("Either 'Payment in LL' or 'Payment in USD' is required.");
      return;
    }

    try {
      await postExpense(expense); // Call the API function to submit data to the backend
      alert("Expense added successfully!");
      setExpense({
        category: '',
        description: '',
        weightinGrams: '',
        date: '',
        paymentinLL: '',
        paymentinUSD: '',
        ExchangeRate: '',
      });
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Expense Entry</h3>

      <label>Category:</label>
      <select name="category" value={expense.category} onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="Regular Facility Expenses">Regular Facility Expenses</option>
        <option value="Purchases & Supplies">Purchases & Supplies</option>
        <option value="Travel & Transportation">Travel & Transportation</option>
        <option value="Irregular Facility Expenses">Irregular Facility Expenses</option>
        <option value="Course & Consultation Fees">Course & Consultation Fees</option>
      </select>

      <label>Description:</label>
      <input
        type="text"
        name="description"
        value={expense.description}
        onChange={handleChange}
        required
      />

      <label>Weight in Grams:</label>
      <input
        type="number"
        name="weightinGrams"
        value={expense.weightinGrams}
        onChange={handleChange}
        min="0"
      />

      <label>Date:</label>
      <input
        type="date"
        name="date"
        value={expense.date}
        onChange={handleChange}
      />

      <label>Payment in LL:</label>
      <input
        type="number"
        name="paymentinLL"
        value={expense.paymentinLL}
        onChange={handleChange}
        min="0"
      />

      <label>Payment in USD:</label>
      <input
        type="number"
        name="paymentinUSD"
        value={expense.paymentinUSD}
        onChange={handleChange}
        min="0"
      />

      <label>Exchange Rate:</label>
      <input
        type="number"
        name="ExchangeRate"
        value={expense.ExchangeRate}
        onChange={handleChange}
        min="0"
        required
      />

      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseEntry;
