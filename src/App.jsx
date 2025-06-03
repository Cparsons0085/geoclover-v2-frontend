import 'leaflet/dist/leaflet.css';
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapPage from "./MapPage";
import CallbackPage from "./CallbackPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/callback" element={<CallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
