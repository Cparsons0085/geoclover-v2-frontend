// import 'leaflet/dist/leaflet.css';
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MapPage from "./MapPage";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect “/” → “/login” */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Explicit login path */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
