import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    try {
      const response = await fetch("https://geoclover-v2-backend-production.up.railway.app/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Signup failed");

      // Optionally auto-login or redirect
      navigate("/login");
    } catch (err) {
      setError("Could not sign up. Try a different username.");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup}>
        <div>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>Sign Up</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
