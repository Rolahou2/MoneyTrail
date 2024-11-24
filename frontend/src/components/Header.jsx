import React from "react";
import logo from "../assets/logo1.png";
import { Link } from "react-router-dom";
import { FaHome, FaBox, FaChartLine, FaWallet, FaFileInvoiceDollar } from "react-icons/fa";

const Header = () => {
  return (
    <div className="header-container">
      <div className="logo-section">
        <Link to="/">
          <img src={logo} alt="BrightClean Logo" className="logo" />
        </Link>
      </div>
      <div className="top-nav">
        <Link to="/">
        <FaHome size={24} title="Home"/>
        </Link>
        <Link to="/product-list">
        <FaBox size={24} title="Products Section"/>
        </Link>
        <Link to="/sales">
        <FaChartLine size={24} title="Sales Section"/>
        </Link>
        <Link to="/expenses">
        <FaWallet size={24} title="Expenses Section"/>
        </Link>
        <Link to="/accounting">
        <FaFileInvoiceDollar size={24} title="Accounting Section"/>
        </Link>
      </div>
    </div>
  );
};

export default Header;
