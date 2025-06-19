// src/MapPage.jsx
import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { io } from "socket.io-client";
import "@arcgis/core/assets/esri/themes/light/main.css";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import Graphic from "@arcgis/core/Graphic";

export default function MapPage() {
  const mapRef = useRef(null);
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewRef, setViewRef] = useState(null);

  // Polling URL
  const QUERY_URL = import.meta.env.VITE_ARCGIS_LAYER_QUERY_URL;
  const CLOVER_SYMBOL_URL = "/clover.png";

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

      setViewRef(view);

      // Real-time socket listener
      socketRef.current.on("add-pin", ({ lat, lng, username, imageUrl }) => {
        const symbol = new PictureMarkerSymbol({ url: CLOVER_SYMBOL_URL, width: "32px", height: "32px" });
        const graphic = new Graphic({
          geometry: { type: "point", x: lng, y: lat, spatialReference: view.spatialReference },
          symbol,
          attributes: { username, imageUrl },
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
          editLayer.removeAll();
          const url = `${QUERY_URL}?where=1%3D1&outFields=*&f=json`;
          const res = await fetch(url);
          const { features } = await res.json();
          features.forEach(f => {
            const { x, y } = f.geometry;
            const { username, imageUrl } = f.attributes;
            const symbol = new PictureMarkerSymbol({ url: CLOVER_SYMBOL_URL, width: "32px", height: "32px" });
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
          setIsLoading(false); // Hide loading after pins are fetched
        } catch (err) {
          console.error("Polling error:", err);
          setIsLoading(false);
        }
      }

      // Start polling every 15s
      fetchPins();
      pollingHandle = setInterval(fetchPins, 15000);
    });

    // Cleanup
    return () => {
      if (viewRef) viewRef.destroy();
      if (socketRef.current) socketRef.current.disconnect();
      if (pollingHandle) clearInterval(pollingHandle);
    };
    // eslint-disable-next-line
  }, []);

  // Handler for the button
  async function handleLuckClick() {
    // Get user location
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      if (viewRef) {
        viewRef.goTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 16 });
      }
      fileInputRef.current.click();
    }, () => {
      setIsLoading(false);
      alert("Could not get your location.");
    });
  }

  // File input handler
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file || !coords) {
      setIsLoading(false);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit("new-pin", {
        username: localStorage.getItem("username"),
        lat: coords.lat,
        lng: coords.lng,
        imageUrl: reader.result
      });
      // Wait for ArcGIS layer to refresh (after next polling)
      setTimeout(() => setIsLoading(false), 16000); // Wait for next poll (15s)
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <Header />
      <button onClick={handleLuckClick} style={{ margin: "10px", fontSize: "1.2em" }}>
        Don't Pluck Your Luck!
      </button>
      {isLoading && (
        <div className="loading-overlay">
          {/* Replace this with a mini-game or animation if you want */}
          <div className="spinner">🌱 Loading your luck...</div>
        </div>
      )}
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
