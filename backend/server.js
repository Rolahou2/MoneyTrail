const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());

// Route imports
const expensesRoutes = require('./routes/expenses');
const productsRoutes = require('./routes/products');
const salesLedgerRoutes = require('./routes/salesLedger');
const accountingRoutes = require('./routes/accounting');
const finishedGoodsRoutes = require('./routes/finishedGoods');
const dashboardRoutes = require('./routes/dashboard');

// Use routes
app.use('/auth', authRoutes); // Add authentication routes
app.use('/expenses', expensesRoutes);
app.use('/products', productsRoutes);
app.use('/sales', salesLedgerRoutes);
app.use('/accounting', accountingRoutes);
app.use('/finishedGoods', finishedGoodsRoutes);


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/detergentDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Define a simple route
app.get('/', (req, res) => res.send('Backend is working!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
