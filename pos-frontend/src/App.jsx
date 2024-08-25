import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout/Layout";
import Customers from "./pages/Customers";
import CustomerDetail from "./components/Pages/Customer/CustomerDetail";
import ProductTable from "./components/Pages/Products/ProductTable";
import TransactionTable from "./components/Pages/Transactions/TransactionTable";

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<ProductTable />} />
          <Route path="/transactions" element={<TransactionTable />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
