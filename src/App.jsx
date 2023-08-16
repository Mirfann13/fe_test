/* eslint no-eval: 0 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import NavbarItem from "./component/navbarItem";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import MasterData from "./pages/masterData";

export default function App() {
  return (
    <div>
      <Router>
        <NavbarItem/>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/masterData" element={<MasterData />} />
        </Routes>
      </Router>
    </div>
  );
}
