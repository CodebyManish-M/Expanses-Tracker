import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignUp from "./components/signup";
import Login from "./components/login"; 
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import AddExpense from "./components/AddExpense";
import ManageExpensc from "./components/ManageExpensc";
import ExpenseReport from "./components/ExpenseReport";
import ChangePassword from "./components/ChangePassword";

import photo1 from "./assets/photo1.jpg";
import "./App.css";

function App() {
  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${photo1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addexpense" element={<AddExpense />} />
          <Route path="/manageexpense" element={<ManageExpensc />} />
          <Route path="/expensereport" element={<ExpenseReport />} />
          <Route path="/changepassword" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
