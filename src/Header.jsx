// src/Header.jsx
const CLIENT_ID = "CUfHhpLopY93670f"; // Client ID
const REDIRECT_URI = import.meta.env.VITE_ARCGIS_REDIRECT_URI;

function Header() {
  function login() {
    const authUrl = `https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = authUrl;
  }

  return (
    <header style={{ padding: "1rem", background: "#f5f5f5" }}>
      <button onClick={login}>Login with ArcGIS</button>
    </header>
  );
}

export default Header;
