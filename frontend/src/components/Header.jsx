import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBox, FaChartLine, FaWallet, FaFileInvoiceDollar, FaSearch } from "react-icons/fa";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="header-container">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-1 gap-3" style={{marginLeft: "40px"}}>
        <Link to="/">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-sky-500">Bright</span>
            <span className="text-sky-700">Clean</span>
          </h1>
        </Link>
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
        <Link to="/" className="nav-link"  style={{ display: "flex", alignItems: "center", gap: "10px"}}>
        <FaHome size={18} title="Home"/>
        <span style={{ fontSize: 20 }}>Home</span>
        </Link>
        <Link to="/product-list" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "10px"}}>
        <FaBox size={18} title="Products Section"/>
        <span style={{fontSize: 20}}>Products</span>
        </Link>
        
        <Link to="/sales" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "10px"}}>
        <FaChartLine size={18} title="Sales Section"/>
        <span style={{ fontSize: 20 }}>Sales</span>
        </Link>
        <Link to="/expenses" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "10px"}}>
        <FaWallet size={18} title="Expenses Section"/>
        <span style={{ fontSize: 20 }}>Expenses</span>
        </Link>
        <Link to="/accounting" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "40px"}}>
        <FaFileInvoiceDollar size={18} title="Accounting Section"/>
        <span style={{ fontSize: 20 }}>Accounting</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
