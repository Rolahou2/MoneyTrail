import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ExpenseEntry from './components/Expenses/ExpenseEntry';
import SalesEntry from './components/Sales/SalesEntry';
import ProductManagement from './components/Products/ProductManagement';
import Dashboard from './components/Dashboard/Dashboard'; // Assume you have a Dashboard component

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Business Dashboard</h1>
        
        {/* Navigation Links */}
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/expenses">Expense Entry</Link></li>
            <li><Link to="/sales">Sales Entry</Link></li>
            <li><Link to="/products">Product Management</Link></li>
          </ul>
        </nav>

        {/* Define Routes */}
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/expenses" component={ExpenseEntry} />
          <Route path="/sales" component={SalesEntry} />
          <Route path="/products" component={ProductManagement} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
