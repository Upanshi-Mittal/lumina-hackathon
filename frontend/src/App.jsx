import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login_page.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Details from "./pages/details.jsx";
import Home from "./pages/home.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Details" element={<Details />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
