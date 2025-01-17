import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBox, FaChartLine, FaWallet, FaFileInvoiceDollar } from "react-icons/fa";

const Home = () => {
  return (
    <div className="home-page-container">
      <div className="two-column-layout">
        {/* Left Column */}
        <div className="left-column">
          <div className="intro-section">
            <p className="description">
            <span className="text-sky-500"><strong>Money</strong></span>
            <span className="text-sky-700"><strong>Trail</strong></span> is an in-house web application designed to streamline
              your business operations. It provides a comprehensive
              platform to:
            </p>
            <ul className="feature-list">
              <li>
              <NavLink to="/product-list"><strong>Manage Products:</strong></NavLink> Add, delete and update product
                details efficiently.
              </li>
              <li>
              <NavLink to="/sales"><strong>Track Sales:</strong></NavLink> Log sales transactions for better
                inventory and revenue tracking.
              </li>
              <li>
              <NavLink to="/expenses"><strong>Monitor Expenses:</strong></NavLink> Record and categorize
                business expenses.
              </li>
              <li>
              <NavLink to="/accounting"><strong>Handle Accounting:</strong></NavLink> Simplify financial
                management with built-in tools.
              </li>
            </ul>
            <p className="conclusion">
              Manage your operations seamlessly with MoneyTrail,
              ensuring better decision-making and productivity.
            </p>
          </div>
        </div>

        {/* Right Column */}

        <div className="right-column">
          <div className="navigation-grid">
            <Link to="/product-list" className="title-icon">
              <FaBox style={{ fontSize: "32px" }} />
              <span>Products</span>
            </Link>
            <Link to="/sales" className="title-icon">
              <FaChartLine style={{ fontSize: "32px" }} />
              <span>Sales</span>
            </Link>
            <Link to="/expenses" className="title-icon">
              <FaWallet style={{ fontSize: "32px" }} />
              <span>Expenses</span>
            </Link>
            <Link to="/accounting" className="title-icon">
              <FaFileInvoiceDollar style={{ fontSize: "32px" }} />
              <span>Accounting</span>
            </Link>
          </div>
        </div> 

      </div>
    </div>
  );
};

export default Home;
