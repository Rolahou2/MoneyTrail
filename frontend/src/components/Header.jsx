import React from "react";
import logo from "../assets/logo1.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header-container">
      <div className="logo-section">
        <Link to="/">
          <img src={logo} alt="BrightClean Logo" className="logo" />
        </Link>
      </div>
      <div className="top-nav">
        <Link to="/" className="nav-icon" title="Home">
          🏠
          <span className="tooltip">Home</span>
        </Link>
        <Link to="/product-list" className="nav-icon" title="Products">
          📦
          <span className="tooltip">Products</span>
        </Link>
        <Link to="/sales" className="nav-icon" title="Sales">
          💰
          <span className="tooltip">Sales</span>
        </Link>
        <Link to="/expenses" className="nav-icon" title="Expenses">
          📊
          <span className="tooltip">Expenses</span>
        </Link>
        <Link to="/accounting" className="nav-icon" title="Accounting">
          🧾
          <span className="tooltip">Accounting</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
