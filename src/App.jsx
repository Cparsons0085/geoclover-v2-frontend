import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";

// Connect to backend
const socket = io("http://localhost:3000");

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function AddPinOnClick({ onAdd }) {
  useMapEvents({
    click(e) {
      const newPin = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        username: "User123",
        imageUrl: "",
      };
      onAdd(newPin);
      socket.emit("new-pin", newPin);
    },
  });
  return null;
}

function App() {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    socket.on("add-pin", (pin) => {
      setPins((prev) => [...prev, pin]);
    });

    return () => socket.off("add-pin");
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h1>Hello GeoClover 🌱</h1>
      <p>If you see this, React is working!</p>
      <MapContainer center={[36.722, -86.577]} zoom={13} style={{ height: "90%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddPinOnClick onAdd={(pin) => setPins((prev) => [...prev, pin])} />
        {pins.map((pin, idx) => (
          <Marker key={idx} position={[pin.lat, pin.lng]}>
            <Popup>Added by {pin.username}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
