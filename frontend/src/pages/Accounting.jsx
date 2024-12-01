import React, { useEffect, useState } from "react";
import { fetchItems } from "../utils/generalUtils";
import ItemsTable from "../components/ItemsTable";

const Accounting = () => {
  const [accountingData, setAccountingData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountingData = async () => {
      setLoading(true);
      try {
        // Fetch sales and expenses data
        const expenses = await fetchItems("/api/expenses");
        const sales = await fetchItems("/api/sales");

        // Aggregate the data per month and year
        const aggregatedData = aggregateAccountingData(expenses, sales);
        setAccountingData(aggregatedData);

        // Prepare data for the chart (number of sold items per month)
        const monthlySales = getMonthlySalesData(sales);
        setMonthlySalesData(monthlySales);
      } catch (error) {
        console.error("Error fetching accounting data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountingData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  
  const accountingColumns = [
    {
      header: "Month",
      accessor: "month",
      isEditable: false,
      type: "number",
    },
    {
      header: "Year",
      accessor: "year",
      isEditable: false,
      type: "number",
    },
    {
      header: "Total Purchases & Supplies",
      accessor: "totalPurchasesAndSupplies",
      isEditable: false,
      type: "number",
    },
    {
      header: "Regular Facility Expenses",
      accessor: "regularFacilityExpenses",
      isEditable: false,
      type: "number",
    },
    {
      header: "Total Sales",
      accessor: "totalSales",
      isEditable: false,
      type: "number",
    },
    {
      header: "Revenues",
      accessor: "revenues",
      isEditable: false,
      type: "number",
    },
    {
      header: "Total Profit",
      accessor: "totalProfit",
      isEditable: false,
      type: "number",
    },
  ];

  return (
    <>
      <div>
          <h1 className="page-title">Accounting Overview</h1>
      </div>
      <div className="table-panel">
        <ItemsTable 
        columns={accountingColumns}
        items={accountingData}
        />
      </div>
</>
  );
};

export default Accounting;

const aggregateAccountingData = (expenses, sales) => {
  const data = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.dateOfExpense);
    const month = date.getMonth() + 1; // Get month (0-indexed, so +1)
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    if (!data[key]) {
      data[key] = {
        month,
        year,
        totalPurchasesAndSupplies: 0,
        regularFacilityExpenses: 0,
        totalSales: 0,
        revenues: 0,
        totalProfit: 0,
      };
    }

    // Categorize expenses
    if (expense.category === "Purchases & Supplies") {
      data[key].totalPurchasesAndSupplies += parseFloat(expense.paidInUSD || 0);
    } else if (expense.category === "Regular Facility Expenses") {
      data[key].regularFacilityExpenses += parseFloat(expense.paidInUSD || 0);
    }
  });

  sales.forEach((sale) => {
    const date = new Date(sale.dateOfPurchase);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    if (!data[key]) {
      data[key] = {
        month,
        year,
        totalPurchasesAndSupplies: 0,
        regularFacilityExpenses: 0,
        totalSales: 0,
        revenues: 0,
        totalProfit: 0,
      };
    }

    // Add sales data
    const saleAmount = parseFloat(sale.totalamount || 0);
    data[key].totalSales += saleAmount;
    data[key].revenues += saleAmount; // Assuming revenue is the same as total sales for simplicity
    data[key].totalProfit += parseFloat(sale.totalProfitLL || 0); // Assuming profit is tracked in `totalProfitLL`
  });

  // Convert data object to an array
  return Object.values(data);
};

// Function to get monthly sales data for the chart
const getMonthlySalesData = (sales) => {
  const monthlySalesCount = {};

  sales.forEach((sale) => {
    const date = new Date(sale.dateOfPurchase);
    const month = date.getMonth() + 1; // 0-indexed, add 1 for correct month
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    if (!monthlySalesCount[key]) {
      monthlySalesCount[key] = {
        label: `${year}-${month}`,
        count: 0,
      };
    }

    monthlySalesCount[key].count += parseInt(sale.quantity, 10) || 0;
  });

  return Object.values(monthlySalesCount);
};