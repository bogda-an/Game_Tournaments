import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/LoginPage.css";

const RegistrationForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ 
    email: "", 
    password: "",
    username: ""
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(credentials.email, credentials.password, credentials.username);
      setSuccess(true);
      setError(null);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(mapAuthError(err.code));
      setSuccess(false);
    }
  };

  const mapAuthError = (code) => {
    switch(code) {
      case "auth/email-already-in-use":
        return "Email already registered";
      case "auth/weak-password":
        return "Password should be at least 6 characters";
      default:
        return "Registration failed. Please try again.";
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Register</h1>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error-message">{error}</p>}
          {success && (
            <p className="success-message">
              Registration successful! Redirecting...
            </p>
          )}

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;