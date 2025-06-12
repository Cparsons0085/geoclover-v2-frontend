import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.status === 409) {
        setError("Username already exists. Try another.");
        return;
      }
      if (!response.ok) throw new Error("Signup failed");

      // Auto-login after signup
      const data = await response.json();
      localStorage.setItem("username", username);
      localStorage.setItem("token", data.token || "fake-token");
      navigate("/map");
    } catch (err) {
      setError("Could not sign up. Try a different username.");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          Sign Up
        </button>
      </form>

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          {error}{" "}
          <Link to="/login" style={{ textDecoration: "underline", color: "blue" }}>
            Back to Login
          </Link>
        </div>
      )}

      <p style={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ textDecoration: "underline", color: "blue" }}>
          Log in here
        </Link>
      </p>
    </div>
  );
}
