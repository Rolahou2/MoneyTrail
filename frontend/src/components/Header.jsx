import React from "react";
import logo from "../assets/logo1.png"
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-slate-100 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to='/'>
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <img src={logo} alt="BrightClean Logo" className="h-24 p-2" />
        </h1>
        </Link>
        <ul className="flex gap-10 text-xl font-semibold">
            <Link to='/'><li className="text-slate-600 hover:opacity-75">Home</li></Link>
            <Link to='/product-list'><li className="text-slate-600 hover:opacity-75">Products</li></Link>
            <Link to='/sales'><li className="text-slate-600 hover:opacity-75">Sales</li></Link>
            <Link to='/expenses'><li className="text-slate-600 hover:opacity-75">Expenses</li></Link>
            <Link to='/accounting'><li className="text-slate-600 hover:opacity-75">Accounting</li></Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
