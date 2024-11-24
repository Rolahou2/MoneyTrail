import React from "react";
import { Link } from "react-router-dom";
import { FaBox, FaChartLine, FaWallet, FaFileInvoiceDollar } from "react-icons/fa";

const Home = () => {
  return (
    <div className="home-page-container">
      <div className="two-column-layout">
        {/* Left Column */}
        <div className="left-column">
          <div className="intro-section">
            <h1>BrightClean</h1>
            <p className="description">
              BrightClean is an in-house web application designed to streamline
              your detergent business operations. It provides a comprehensive
              platform to:
            </p>
            <ul className="feature-list">
              <li>
                <strong>Manage Products:</strong> Add, delete and update product
                details efficiently.
              </li>
              <li>
                <strong>Track Sales:</strong> Log sales transactions for better
                inventory and revenue tracking.
              </li>
              <li>
                <strong>Monitor Expenses:</strong> Record and categorize
                business expenses.
              </li>
              <li>
                <strong>Handle Accounting:</strong> Simplify financial
                management with built-in tools.
              </li>
              <li>
                <strong>View Dashboards:</strong> Gain insights into business
                progress through real-time dashboards.
              </li>
            </ul>
            <p className="conclusion">
              With BrightClean, you can manage your operations seamlessly,
              ensuring better decision-making and productivity.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="navigation-grid">
            <Link to="/product-list" className="title-icon">
              <FaBox style={{ fontSize: "36px" }} />
              <span>Products</span>
            </Link>
            <Link to="/sales" className="title-icon">
              <FaChartLine style={{ fontSize: "36px" }} />
              <span>Sales</span>
            </Link>
            <Link to="/expenses" className="title-icon">
              <FaWallet style={{ fontSize: "36px" }} />
              <span>Expenses</span>
            </Link>
            <Link to="/accounting" className="title-icon">
              <FaFileInvoiceDollar style={{ fontSize: "36px" }} />
              <span>Accounting</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
