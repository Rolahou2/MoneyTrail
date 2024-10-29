import React, { useEffect, useState } from 'react';
import { getExpenses, getSales } from '../../api/api';

const Summary = () => {
  const [summary, setSummary] = useState({ totalExpenses: 0, totalSales: 0 });

  const fetchSummaryData = async () => {
    try {
      // Fetch expenses data
      const expensesResponse = await getExpenses();
      const totalExpenses = expensesResponse.data.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

      // Fetch sales data
      const salesResponse = await getSales();
      const totalSales = salesResponse.data.reduce((sum, sale) => sum + parseFloat(sale.price) * sale.quantity, 0);

      // Set summary data
      setSummary({ totalExpenses, totalSales });
    } catch (error) {
      console.error("Failed to fetch summary data:", error);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  return (
    <div>
      <h3>Dashboard Summary</h3>
      <p>Total Expenses: ${summary.totalExpenses}</p>
      <p>Total Sales: ${summary.totalSales}</p>
    </div>
  );
};

export default Summary;
