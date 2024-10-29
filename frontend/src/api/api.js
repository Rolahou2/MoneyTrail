import axios from 'axios';

// Create an Axios instance with a base URL for the backend API
const API = axios.create({ baseURL: 'http://localhost:5000' }); // Adjust the baseURL if your backend server runs on a different URL

// ------------------ Expense API Functions ------------------

// POST request to add a new expense
export const postExpense = (expenseData) => API.post('/expenses', expenseData);

// GET request to fetch all expenses
export const getExpenses = () => API.get('/expenses');

// GET request to fetch a single expense by ID (optional, for viewing or editing an individual expense)
export const getExpenseById = (id) => API.get(`/expenses/${id}`);

// PUT request to update an expense by ID (optional, for editing an existing expense)
export const updateExpense = (id, updatedData) => API.put(`/expenses/${id}`, updatedData);

// DELETE request to delete an expense by ID (optional, if deletion is required)
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);

// ------------------ Sales API Functions ------------------

// POST request to add a new sale entry
export const postSale = (saleData) => API.post('/sales', saleData);

// GET request to fetch all sales entries
export const getSales = () => API.get('/sales');

// GET request to fetch a single sale entry by ID (optional, for viewing or editing an individual sale)
export const getSaleById = (id) => API.get(`/sales/${id}`);

// PUT request to update a sale entry by ID (optional, for editing an existing sale entry)
export const updateSale = (id, updatedData) => API.put(`/sales/${id}`, updatedData);

// DELETE request to delete a sale entry by ID (optional, if deletion is required)
export const deleteSale = (id) => API.delete(`/sales/${id}`);

// ------------------ Product Pricing API Functions ------------------

// POST request to add a new product
export const postProduct = (productData) => API.post('/products', productData);

// GET request to fetch all products
export const getProducts = () => API.get('/products');

// GET request to fetch a single product by ID (optional, for viewing or editing an individual product)
export const getProductById = (id) => API.get(`/products/${id}`);

// PUT request to update a product by ID (optional, for editing an existing product)
export const updateProduct = (id, updatedData) => API.put(`/products/${id}`, updatedData);

// DELETE request to delete a product by ID (optional, if deletion is required)
export const deleteProduct = (id) => API.delete(`/products/${id}`);
