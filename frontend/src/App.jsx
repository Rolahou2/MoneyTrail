import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Header from "./components/Header";
import Sales from "./pages/Sales";
import Expenses from "./pages/Expenses";
import Accounting from "./pages/Accounting";
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/accounting" element={<Accounting />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
