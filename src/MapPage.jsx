// src/MapPage.jsx
import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { io } from "socket.io-client";
import "@arcgis/core/assets/esri/themes/light/main.css";

export default function MapPage() {
  const mapRef = useRef(null);
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    let view;
    let editLayer;

    // 1) Initialize Socket.IO
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["polling"]
    });

    // 2) Dynamic imports of ArcGIS modules
    Promise.all([
      import("@arcgis/core/WebMap"),
      import("@arcgis/core/views/MapView"),
      import("@arcgis/core/layers/GraphicsLayer"),
      import("@arcgis/core/Graphic"),
      import("@arcgis/core/symbols/PictureMarkerSymbol"),
    ]).then(([
      { default: WebMap },
      { default: MapView },
      { default: GraphicsLayer },
      { default: Graphic },
      { default: PictureMarkerSymbol },
    ]) => {
      // 3) Create map and layers
      const webmap = new WebMap({
        portalItem: { id: "15d03b522d84442686b21e18e7c71c1d" },
      });
      editLayer = new GraphicsLayer({ title: "Live Pins" });
      webmap.add(editLayer);

      view = new MapView({
        container: mapRef.current,
        map: webmap,
        center: [-98.5, 39.8],
        zoom: 4,
      });

      // 4) Listen for pins from the server
      socketRef.current.on("add-pin", ({ lat, lng, username, imageUrl }) => {
        const symbol = new PictureMarkerSymbol({
          url: imageUrl,
          width: "32px",
          height: "32px",
        });
        const graphic = new Graphic({
          geometry: {
            type: "point",
            x: lng,
            y: lat,
            spatialReference: view.spatialReference,
          },
          symbol,
          attributes: { username },
          popupTemplate: {
            title: "{username}",
            content: `<img src="${imageUrl}" style="max-width:200px;"/>`,
          },
        });
        editLayer.add(graphic);
      });

      // 5) On map click, trigger file picker
      view.on("click", (event) => {
        // DEBUG: log map click coordinates
        console.log("map click at", {
          lat: event.mapPoint.y,
          lng: event.mapPoint.x
        });

        const username = localStorage.getItem("username");
        if (!username) {
          view.popup.open({
            title: "Not signed in",
            content: "Please log in before dropping a pin.",
            location: event.mapPoint,
          });
          return;
        }
        // save coords then open picker
        setCoords({ lat: event.mapPoint.y, lng: event.mapPoint.x });
        fileInputRef.current.click();
      });
    });

    // 6) Clean up on unmount
    return () => {
      if (view) {
        view.destroy();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // 7) When the user selects a file, read & emit
  function handleFileChange(e) {
    const file = e.target.files[0];
    console.log("handleFileChange fired, file:", file, "coords:", coords);
    if (!file || !coords) return;

    const reader = new FileReader();
    reader.onload = () => {
      console.log("about to emit new-pin, size:", (reader.result || "").length);
      socketRef.current.emit("new-pin", {
        username: localStorage.getItem("username"),
        lat: coords.lat,
        lng: coords.lng,
        imageUrl: reader.result, // base64 data URL
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <Header />
      <div
        style={{ height: "90vh", width: "100%" }}
        ref={mapRef}
      />
      {/* hidden file input for photo upload */}
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
