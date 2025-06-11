import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch("https://geoclover-v2-backend-production.up.railway.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      localStorage.setItem("username", username);
      localStorage.setItem("token", data.token);
      onLogin?.(username);
      navigate("/map");
    } catch (err) {
      setError("Invalid login. Try again.");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login to GeoClover</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>
          Log In
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      {/* Add this: */}
      <p style={{ marginTop: "1rem" }}>
        Don't have an account?{" "}
        <button onClick={() => navigate("/signup")} style={{ textDecoration: "underline", background: "none", border: "none", color: "blue", cursor: "pointer" }}>
          Sign up
        </button>
      </p>
    </div>
  );
}
