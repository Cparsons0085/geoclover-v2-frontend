# GeoClover-v2 Frontend

This is the frontend for the GeoClover-v2 web app — a geospatial application where users can explore and document four-leaf clover sightings using interactive maps, custom usernames, and a playful mascot.

Built using React + Vite, the app includes a lightweight login system with user-generated usernames and short passwords (no ArcGIS OAuth required). Users can interact with real-time map features, doodle mini-games, and a dynamic clover mascot for hints and guidance.

---

## 🌟 Key Features

- Custom **username + short password** login (4–8 characters)
- Submit clover sightings with GPS and photo
- Real-time interactive map using ArcGIS JS API
- "GeoClover Doodles" – creative canvas + mini spatial puzzle games
- Clover mascot guides users and reacts to interactions
- Settings and preferences saved using localStorage

---

## 🔐 Authentication

No ArcGIS login required. Users create a short username and password directly in the app on the landing screen.

---

## 🛠️ Tech Stack

- **React + Vite** – frontend framework
- **ArcGIS JS API** – mapping and spatial visualization
- **Socket.IO** – live map communication with backend
- **Axios** – RESTful API calls
- **Tailwind CSS** – responsive styling
- **localStorage** – persistent user settings

---

## 🚀 Getting Started

```bash
npm install
npm run dev

