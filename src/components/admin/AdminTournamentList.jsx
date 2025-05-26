import React from "react";

const AdminTournamentList = ({ tournaments, onEdit, onDelete }) => {
  const formatDate = (raw) => {
    if (!raw) return "N/A";
    const dateObj = raw.toDate ? raw.toDate() : raw;   
    return dateObj.toLocaleDateString();
  };

  return (
    <div className="tournament-list">
      <h2>Manage Tournaments</h2>

      {tournaments.length === 0 ? (
        <p className="no-tournaments">No tournaments found</p>
      ) : (
        <div className="tournament-items">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-item admin">
              <h3>{tournament.title}</h3>
              <p>Date: {formatDate(tournament.date)}</p>
              <p>Location: {tournament.location}</p>
              <p>Available Spots: {tournament.available_spots}</p>

              <div className="admin-actions">
                <button
                  className="edit-button"
                  onClick={() => onEdit(tournament)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDelete(tournament.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTournamentList;
