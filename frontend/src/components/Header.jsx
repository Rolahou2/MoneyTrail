import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHome, FaBox, FaChartLine, FaWallet, FaFileInvoiceDollar, FaSearch } from "react-icons/fa";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="header-container">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-1 gap-3" style={{marginLeft: "40px"}}>
        <NavLink to="/">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-sky-500">Money</span>
            <span className="text-sky-700">Trail</span>
          </h1>
        </NavLink>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-20 h-3 sm:w-52"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
          <FaSearch className="text-slate-600" />
          </button>
        </form>
      </div>
      <div className="top-nav">
        <NavLink to="/" className="nav-link"  
        style={({ isActive }) => ({
          display: "flex",
          alignItems: "center",
          gap: "7px",
          color: isActive ? "#7f8c8d" : "#7dd3fc",
          textDecoration: "none",
        })}>
        <FaHome size={18} title="Home"/>
        <span style={{ fontSize: 18 }}>Home</span>
        </NavLink>
        <NavLink to="/product-list" className="nav-link" 
        style={({ isActive }) => ({
          display: "flex",
          alignItems: "center",
          gap: "7px",
          color: isActive ? "#7f8c8d" : "#7dd3fc",
          textDecoration: "none",
        })}>
        <FaBox size={18} title="Products Section"/>
        <span style={{fontSize: 18}}>Products</span>
        </NavLink>
        
        <NavLink to="/sales" className="nav-link" 
        style={({ isActive }) => ({
          display: "flex",
          alignItems: "center",
          gap: "7px",
          color: isActive ? "#7f8c8d" : "#7dd3fc",
          textDecoration: "none",
        })}>
        <FaChartLine size={18} title="Sales Section"/>
        <span style={{ fontSize: 18 }}>Sales</span>
        </NavLink>
        <NavLink to="/expenses" className="nav-link" 
        style={({ isActive }) => ({
          display: "flex",
          alignItems: "center",
          gap: "7px",
          color: isActive ? "#7f8c8d" : "#7dd3fc",
          textDecoration: "none",
        })}>
        <FaWallet size={18} title="Expenses Section"/>
        <span style={{ fontSize: 18 }}>Expenses</span>
        </NavLink>
        <NavLink to="/accounting" className="nav-link" 
        style={({ isActive }) => ({
          display: "flex",
          alignItems: "center",
          gap: "7px",
          color: isActive ? "#7f8c8d" : "#7dd3fc",
          textDecoration: "none",
           marginRight: "40px",
        })}>
        <FaFileInvoiceDollar size={18} title="Accounting Section"/>
        <span style={{ fontSize: 18 }}>Accounting</span>
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
