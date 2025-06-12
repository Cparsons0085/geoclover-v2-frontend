// MapPage.jsx
import React, { useEffect, useRef } from "react";
import Header from "./Header";
import io from "socket.io-client";

export default function MapPage() {
  const mapRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    let view;
    let pinLayer;      // the view‐only layer in the WebMap
    let editLayer;     // our client‐side GraphicsLayer

    // 1) Initialize Socket.IO
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
    });

    import("@arcgis/core/WebMap").then(({ default: WebMap }) =>
      import("@arcgis/core/views/MapView").then(({ default: MapView }) =>
      import("@arcgis/core/layers/GraphicsLayer").then(({ default: GraphicsLayer }) =>
      import("@arcgis/core/Graphic").then(({ default: Graphic }) =>
      import("@arcgis/core/symbols/PictureMarkerSymbol").then(
        ({ default: PictureMarkerSymbol }) => {
          // 2) Load your WebMap
          const webmap = new WebMap({
            portalItem: { id: "15d03b522d84442686b21e18e7c71c1d" },
          });

          // 3) Create the MapView
          view = new MapView({
            container: mapRef.current,
            map: webmap,
            highlightOptions: {
              color: [255, 255, 255],
              haloOpacity: 1,
              fillOpacity: 0.1,
            },
          });

          view.when(() => {
            // 4) Find the read‐only view layer
            pinLayer = webmap.layers.find(
              (l) => l.title === "GeoCloverPins_4view"
            );

            // 5) Add an empty GraphicsLayer for new pins
            editLayer = new GraphicsLayer({ title: "Live Pins" });
            view.map.add(editLayer);

            // 6) Listen for real-time adds
            socketRef.current.on("add-pin", (pin) => {
              const marker = new PictureMarkerSymbol({
                url: pin.imageUrl,
                width: "32px",
                height: "32px",
              });
              const graphic = new Graphic({
                geometry: {
                  type: "point",
                  x: pin.lng,
                  y: pin.lat,
                  spatialReference: { wkid: 4326 },
                },
                symbol: marker,
                attributes: { username: pin.username, imageUrl: pin.imageUrl },
                popupTemplate: {
                  title: "{username}",
                  content: `<img src="{imageUrl}" style="max-width:200px" />`,
                },
              });
              editLayer.add(graphic);
            });

            // 7) On map‐click: drop a pin + prompt for photo
            view.on("click", (event) => {
              const { latitude: y, longitude: x } = event.mapPoint;
              const username = localStorage.getItem("username");
              if (!username) {
                view.popup.open({
                  title: "Not signed in",
                  content: "Please log in before dropping a pin.",
                  location: event.mapPoint,
                });
                return;
              }

              // Use a file input to capture or select a photo
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.capture = "environment";
              input.onchange = () => {
                const file = input.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  // 8) Emit to backend
                  socketRef.current.emit("new-pin", {
                    username,
                    lat: y,
                    lng: x,
                    imageUrl: reader.result, // base64
                  });
                };
                reader.readAsDataURL(file);
              };
              input.click();
            });
          });
        }
      ))))
    );

    return () => {
      // Clean up
      if (view) {
        view.destroy();
        view = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Header />
      <div
        style={{ height: "90vh", width: "100%" }}
        ref={mapRef}
      ></div>
    </>
  );
}
