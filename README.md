# GeoClover-v2 Frontend

> A React + Vite app for GeoClover-v2: explore and document four-leaf clover sightings on an interactive map.

---

## 👩‍💻 About Me

👋 Hi, I’m **Cristy Parsons** ([@Cparsons0085](https://github.com/Cparsons0085))  
🎓 Currently pursuing Geospatial Technologies with a background in DevOps & Full-Stack  
🔭 Building GeoClover-v2: a fun, GIS-powered pin-drop experience  
📫 Reach me via GitHub Issues or email at `cristylynn0920@gmail.com`

---

## 🌟 Key Features

- **Username/Password Login** (no ArcGIS OAuth)  
- **Real-time Map Pins** via Socket.IO & ArcGIS JS API  
- **Photo Capture**: snap a picture of your clover on click  
- **GeoClover Doodles**: mini coding-themed sketch games  
- **Clover Mascot**: playful guide for hints and interactions  
- **Persistent Settings** with `localStorage`

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite  
- **Mapping**: ArcGIS JS API  
- **Realtime**: Socket.IO (client)  
- **HTTP**: Axios  
- **Styling**: Tailwind CSS  
- **Persistence**: `localStorage`  

---

## ⚙️ Environment Variables

Create two files in the project root (already in `.gitignore`):

### `.env.development`

```dotenv
VITE_ARCGIS_CLIENT_ID=yourArcGISClientID
VITE_ARCGIS_REDIRECT_URI=http://localhost:5173/callback
VITE_BACKEND_URL=http://localhost:3000
VITE_ARCGIS_VIEW_URL=https://services1.arcgis.com/.../GeoCloverPins_4view/FeatureServer/0
