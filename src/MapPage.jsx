// src/MapPage.jsx
import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { io } from "socket.io-client";
import "@arcgis/core/assets/esri/themes/light/main.css";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import Graphic from "@arcgis/core/Graphic";

console.log(">> ARCGIS QUERY URL:", import.meta.env.VITE_ARCGIS_LAYER_QUERY_URL);

export default function MapPage() {
  const mapRef = useRef(null);
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);
  const [coords, setCoords] = useState(null);

  // Polling URL
  const QUERY_URL = import.meta.env.VITE_ARCGIS_LAYER_QUERY_URL;

  useEffect(() => {
    let view;
    let editLayer;
    let pollingHandle;

    // Initialize Socket.IO
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["polling", "websocket"]
    });

    // Dynamic import of ArcGIS modules
    Promise.all([
      import("@arcgis/core/WebMap"),
      import("@arcgis/core/views/MapView"),
      import("@arcgis/core/layers/GraphicsLayer")
    ]).then(async ([WebMapMod, MapViewMod, GraphicsLayerMod]) => {
      const WebMap = WebMapMod.default;
      const MapView = MapViewMod.default;
      const GraphicsLayer = GraphicsLayerMod.default;

      // Create map and layer
      const webmap = new WebMap({ portalItem: { id: "15d03b522d84442686b21e18e7c71c1d" } });
      editLayer = new GraphicsLayer({ title: "Live Pins" });
      webmap.add(editLayer);

      view = new MapView({
        container: mapRef.current,
        map: webmap,
        center: [-98.5, 39.8],
        zoom: 4
      });

      // Real-time socket listener
      socketRef.current.on("add-pin", ({ lat, lng, username, imageUrl }) => {
        const symbol = new PictureMarkerSymbol({ url: imageUrl, width: "32px", height: "32px" });
        const graphic = new Graphic({
          geometry: { type: "point", x: lng, y: lat, spatialReference: view.spatialReference },
          symbol,
          attributes: { username },
          popupTemplate: {
            title: "{username}",
            content: `<img src="${imageUrl}" style="max-width:200px;"/>`
          }
        });
        editLayer.add(graphic);
      });

      // Polling function
      async function fetchPins() {
        try {
          const url = `${QUERY_URL}?where=1%3D1&outFields=*&f=json`;
          const res = await fetch(url);
          const { features } = await res.json();
          features.forEach(f => {
            const { x, y } = f.geometry;
            const { username, imageUrl } = f.attributes;
            const symbol = new PictureMarkerSymbol({ url: imageUrl, width: "32px", height: "32px" });
            const graphic = new Graphic({
              geometry: { type: "point", x, y, spatialReference: view.spatialReference },
              symbol,
              attributes: { username },
              popupTemplate: {
                title: "{username}",
                content: `<img src="${imageUrl}" style="max-width:200px;"/>`
              }
            });
            editLayer.add(graphic);
          });
        } catch (err) {
          console.error("Polling error:", err);
        }
      }

      // Start polling every 15s
      fetchPins();
      pollingHandle = setInterval(fetchPins, 15000);

      // Map click handler
      view.on("click", event => {
        console.log("map click at", { lat: event.mapPoint.y, lng: event.mapPoint.x });
        const username = localStorage.getItem("username");
        if (!username) {
          view.popup.open({ title: "Not signed in", content: "Please log in before dropping a pin.", location: event.mapPoint });
          return;
        }
        setCoords({ lat: event.mapPoint.y, lng: event.mapPoint.x });
        fileInputRef.current.click();
      });
    });

    // Cleanup
    return () => {
      if (view) view.destroy();
      if (socketRef.current) socketRef.current.disconnect();
      if (pollingHandle) clearInterval(pollingHandle);
    };
  }, []);

  // File input handler
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file || !coords) return;
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit("new-pin", {
        username: localStorage.getItem("username"),
        lat: coords.lat,
        lng: coords.lng,
        imageUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <Header />
      <div style={{ height: "90vh", width: "100%" }} ref={mapRef} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}
