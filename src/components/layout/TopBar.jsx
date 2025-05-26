// src/components/layout/TopBar.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/TopBar.css";

const TopBar = ({ homeRef, tournamentsRef, regsRef }) => {
  const { logout } = useAuth();
  const navigate  = useNavigate();

  const scrollTo = (ref) =>
    ref?.current?.scrollIntoView({ behavior: "smooth" });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");                           
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="top-bar">
      <ul>
        <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Home
        </li>

        <li onClick={() => scrollTo(tournamentsRef)}>Tournaments</li>
        <li onClick={() => scrollTo(regsRef)}>My&nbsp;Registrations</li>
        <li onClick={handleLogout}>Log&nbsp;out</li>
      </ul>
    </nav>
  );
};

export default TopBar;
