import React from "react";
import TournamentCard from "./TournamentCard";
import "../../styles/TournamentCard.css";

const TournamentList = ({ tournaments, refreshData }) => {
  return (
    <div className="tournament-list-container">
      {tournaments.map((tournament) => (
        <TournamentCard 
          key={tournament.id}
          tournament={tournament}
          refreshData={refreshData} 
        />
      ))}
    </div>
  );
};

export default TournamentList;