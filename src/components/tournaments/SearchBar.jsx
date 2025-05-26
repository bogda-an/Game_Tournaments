import React, { useState } from "react";
import "../../styles/SearchBar.css"; 

const SearchBar = ({ onSearch }) => {
  const [criteria, setCriteria] = useState({ title: "", date: "", location: "" });

  const handleChange = (e) => {
    setCriteria({ ...criteria, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(criteria);
  };

  return (
    <div className="search-bar-container">
    <h2>Find a Tournament</h2>
    <p>Search for tournaments by game title, date, or location. Explore your next challenge!</p>
    <div className="SearchBar">
    
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        id="title"
        type="text"
        name="title"
        placeholder="Game Title"
        value={criteria.title}
        onChange={handleChange}
      />
      <input
        type="date"
        name="date"
        value={criteria.date}
        onChange={handleChange}
      />
      <input
        id="location"
        type="text"
        name="location"
        placeholder="Location"
        value={criteria.location}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
    </div>
    </div>
  );
};

export default SearchBar;
