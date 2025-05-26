import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/HeroSection.css";
import bgImage from "../../images/hero1.png";

const HeroSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="hero-overlay">
        <h1 className="hero-title">Hello, {user?.displayName || "Player"}!</h1>
        <p className="hero-subtitle">
          Ready to compete? Check out the latest tournaments or view your current registrations.
        </p>
      </div>
    </section>
  );
};
export default HeroSection;