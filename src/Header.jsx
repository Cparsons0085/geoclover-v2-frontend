// App.jsx
// Trigger redeploy

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUsername(null);
    navigate("/");
  };

  return (
    <header style={{ padding: "1rem", background: "#f5f5f5" }}>
      {username ? (
        <>
          <span className="welcome-text">🍀 Welcome, {username}!</span>
          <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")} style={{ marginLeft: "1rem" }}>
            Sign Up
          </button>
        </>
      )}
    </header>
  );
}

export default Header;

