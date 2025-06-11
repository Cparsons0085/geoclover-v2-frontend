import 'leaflet/dist/leaflet.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapPage from "./MapPage";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
